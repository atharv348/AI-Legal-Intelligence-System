from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import timedelta
from jose import JWTError, jwt

from app.services.search_engine import LegalSearchEngine
from app.services.outcome_predictor import CaseOutcomePredictor
from app.services.doc_drafter import MultilingualDocDrafter
from app.services.rights_chatbot import RightsChatbot
from app.services.docket_intel import CourtDocketIntel
from app.services.ocr_service import OCRService
from fastapi import File, UploadFile, Form
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.excel_db import get_user_by_email, add_user, init_db, update_user

router = APIRouter()
init_db()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

# --- Request/Response Models ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    dob: str
    phone: str
    role: str
    location: str

class UserInDB(User):
    hashed_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- Security Functions ---
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        print("[Auth] JWT Decode Error")
        raise credentials_exception
    except Exception as e:
        print(f"[Auth] Unexpected Error: {e}")
        raise credentials_exception

    user = get_user_by_email(token_data.email)
    if user is None:
        print(f"[Auth] User not found in DB: {token_data.email}")
        raise credentials_exception
    
    # Handle potentially missing fields from old excel rows and ensure types
    disabled_val = user.get("disabled")
    if isinstance(disabled_val, str):
        disabled_val = disabled_val.lower() == "true"
    elif disabled_val is None:
        disabled_val = False

    user_dict = {
        "username": user.get("username"),
        "email": user.get("email"),
        "full_name": user.get("full_name"),
        "disabled": bool(disabled_val),
        "dob": str(user.get("dob", "")),
        "phone": str(user.get("phone", "")),
        "role": str(user.get("role", "")),
        "location": str(user.get("location", ""))
    }
    return User(**user_dict)

# --- Auth Endpoints ---
@router.post("/register", response_model=User)
async def register(user_in: UserCreate):
    user = get_user_by_email(user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )
    
    user_data = {
        "username": user_in.email,
        "email": user_in.email,
        "full_name": user_in.full_name,
        "hashed_password": get_password_hash(user_in.password),
        "disabled": False,
        "dob": user_in.dob,
        "phone": user_in.phone,
        "role": user_in.role,
        "location": user_in.location
    }
    
    if add_user(user_data):
        return User(**user_data)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/me", response_model=User)
async def update_user_me(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    update_data = user_update.dict(exclude_unset=True)
    if not update_data:
        return current_user
    
    if update_user(current_user.email, update_data):
        updated_user = get_user_by_email(current_user.email)
        return User(**updated_user)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user",
        )

# --- Dependency Injection --- 
def get_ocr_service():
    return OCRService()
def get_search_engine():
    return LegalSearchEngine()

def get_outcome_predictor(search_engine: LegalSearchEngine = Depends(get_search_engine)):
    return CaseOutcomePredictor(search_engine)

def get_doc_drafter():
    return MultilingualDocDrafter()

def get_rights_chatbot(search_engine: LegalSearchEngine = Depends(get_search_engine)):
    return RightsChatbot(search_engine)

def get_docket_intel():
    return CourtDocketIntel()

# --- Request/Response Models ---
class SearchRequest(BaseModel):
    question: str

class SearchResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]

class CaseFacts(BaseModel):
    facts: str

class LegalQuestion(BaseModel):
    question: str
    language: str = "en"

class DocumentDraftRequest(BaseModel):
    description: str
    doc_type: str
    language: str = "en"

# --- API Endpoints ---

@router.post("/search", response_model=SearchResponse)
async def semantic_search(
    question: str = Form(...),
    file: Optional[UploadFile] = File(None),
    search_engine: LegalSearchEngine = Depends(get_search_engine),
    ocr_service: OCRService = Depends(get_ocr_service)
):
    try:
        final_query = question
        if file:
            content = await file.read()
            extracted_text = ocr_service.extract_text(content)
            if extracted_text:
                final_query = f"{question}\n\n[Extracted from document]:\n{extracted_text}"
        
        results = search_engine.search(final_query)
        return results
    except Exception as e:
        print(f"Error in /search endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-outcome")
async def predict_outcome(
    request: CaseFacts, 
    predictor: CaseOutcomePredictor = Depends(get_outcome_predictor)
):
    try:
        prediction = predictor.predict(request.facts)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/draft-document")
async def draft_document(
    request: DocumentDraftRequest, 
    drafter: MultilingualDocDrafter = Depends(get_doc_drafter)
):
    try:
        draft = drafter.generate_draft(request.description, request.doc_type, request.language)
        return {"draft": draft}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chatbot")
async def rights_chatbot_endpoint(
    question: str = Form(...),
    language: str = Form("en"),
    file: Optional[UploadFile] = File(None),
    chatbot: RightsChatbot = Depends(get_rights_chatbot),
    ocr_service: OCRService = Depends(get_ocr_service)
):
    try:
        final_query = question
        if file:
            content = await file.read()
            extracted_text = ocr_service.extract_text(content)
            if extracted_text:
                final_query = f"{question}\n\n[Extracted from document]:\n{extracted_text}"
        
        response = chatbot.get_response(final_query, language)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chatbot/whatsapp")
async def whatsapp_chatbot_endpoint(
    request: LegalQuestion, 
    chatbot: RightsChatbot = Depends(get_rights_chatbot)
):
    try:
        response = chatbot.get_whatsapp_response(request.question, request.language)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    docket_intel: CourtDocketIntel = Depends(get_docket_intel)
):
    try:
        stats = docket_intel.get_dashboard_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/detect-abuse/{lawyer_id}")
async def detect_abuse(
    lawyer_id: str, 
    docket_intel: CourtDocketIntel = Depends(get_docket_intel)
):
    try:
        abuse_info = docket_intel.detect_adjournment_abuse(lawyer_id)
        return abuse_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
