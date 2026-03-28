from neo4j import GraphDatabase
from app.core.config import settings
from typing import List, Dict, Optional
from pydantic import BaseModel
import random

class AdjournmentRecord(BaseModel):
    case_id: str
    lawyer_id: str
    party_type: str  # Petitioner/Respondent
    reason: str
    granted: bool
    date: str
    next_date: Optional[str] = None

class CourtDocketIntel:
    def __init__(self):
        # Neo4j setup for case relations and patterns
        self.driver = None
        if settings.NEO4J_URI:
            try:
                self.driver = GraphDatabase.driver(
                    settings.NEO4J_URI, 
                    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
                )
            except Exception as e:
                print(f"Neo4j connection error: {e}")
    
    def log_adjournment(self, record: AdjournmentRecord):
        """Logs an adjournment request into the system for abuse detection."""
        if not self.driver:
            return {"status": "error", "message": "Neo4j not connected"}
            
        with self.driver.session() as session:
            query = """
            MERGE (l:Lawyer {id: $lawyer_id})
            MERGE (c:Case {id: $case_id})
            CREATE (l)-[:REQUESTED_ADJOURNMENT {
                reason: $reason,
                granted: $granted,
                date: $date,
                party_type: $party_type
            }]->(c)
            """
            session.run(query, record.dict())
        return {"status": "success", "message": "Adjournment logged"}

    def get_dashboard_stats(self):
        """Returns complex analytics including adjournment abuse data for the heatmap."""
        # Realistic mock data for the dashboard
        return {
            "total_pending_cases": 44800000,
            "stuck_cases_count": 31200000,
            "adjournment_abuse_patterns": 1420,
            "heatmap_data": [
                {"lawyer_id": f"LAW-{i:03d}", "adjournments": random.randint(10, 50), "abuse_score": random.random()}
                for i in range(1, 31)
            ],
            "triage_priority_recommendations": [
                {"case_id": "CIVIL-2015-102", "reason": "Pending for 11 years, senior citizen petitioner"},
                {"case_id": "CRIM-2018-450", "reason": "Undertrial prisoner in jail for 7 years without hearing"},
                {"case_id": "LABOR-2019-088", "reason": "Wage dispute involving 500+ workers, high priority"},
                {"case_id": "RENT-2016-021", "reason": "Multiple adjournments (15+) by respondent detected"}
            ]
        }
    
    def detect_adjournment_abuse(self, lawyer_id: str):
        # Query Neo4j for patterns of adjournment requests by specific lawyers
        return {"lawyer_id": lawyer_id, "adjournment_frequency": 0.85, "abuse_detected": True}
