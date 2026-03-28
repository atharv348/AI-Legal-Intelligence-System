import pandas as pd
import os
from app.core.security import get_password_hash

EXCEL_DB_PATH = "users_db.xlsx"

def init_db():
    required_columns = [
        "username", "full_name", "email", "hashed_password", 
        "disabled", "dob", "phone", "role", "location"
    ]
    
    if not os.path.exists(EXCEL_DB_PATH):
        df = pd.DataFrame(columns=required_columns)
        # Add default admin
        admin_user = {
            "username": "admin@alis.ai",
            "full_name": "ALIS Admin",
            "email": "admin@alis.ai",
            "hashed_password": get_password_hash("password123"),
            "disabled": False,
            "dob": "1990-01-01",
            "phone": "0000000000",
            "role": "Admin",
            "location": "System"
        }
        df = pd.concat([df, pd.DataFrame([admin_user])], ignore_index=True)
        df.to_excel(EXCEL_DB_PATH, index=False)
    else:
        # Migration: Add missing columns if file exists
        df = pd.read_excel(EXCEL_DB_PATH)
        modified = False
        for col in required_columns:
            if col not in df.columns:
                df[col] = ""
                modified = True
        if modified:
            df.to_excel(EXCEL_DB_PATH, index=False)

def get_all_users():
    if not os.path.exists(EXCEL_DB_PATH):
        init_db()
    # Read all columns as strings to prevent float conversion of numbers (like phone)
    df = pd.read_excel(EXCEL_DB_PATH, dtype=str)
    # Handle 'disabled' specifically as boolean if needed, but for now string is safer
    # and we can convert it in get_current_user if necessary.
    return df.to_dict('records')

def get_user_by_email(email: str):
    users = get_all_users()
    for user in users:
        if user['email'] == email:
            return user
    return None

def add_user(user_data: dict):
    if not os.path.exists(EXCEL_DB_PATH):
        init_db()
    df = pd.read_excel(EXCEL_DB_PATH)
    # Check if user already exists
    if user_data['email'] in df['email'].values:
        return False
    
    new_user_df = pd.DataFrame([user_data])
    df = pd.concat([df, new_user_df], ignore_index=True)
    df.to_excel(EXCEL_DB_PATH, index=False)
    return True

def update_user(email: str, updated_data: dict):
    if not os.path.exists(EXCEL_DB_PATH):
        return False
    df = pd.read_excel(EXCEL_DB_PATH)
    if email not in df['email'].values:
        return False
    
    for key, value in updated_data.items():
        if key in df.columns:
            df.loc[df['email'] == email, key] = value
            
    df.to_excel(EXCEL_DB_PATH, index=False)
    return True

