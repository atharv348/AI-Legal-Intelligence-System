import os
import sys
import random
from datetime import datetime, timedelta

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.services.docket_intel import CourtDocketIntel, AdjournmentRecord

def simulate_ecourts_data(num_records=100):
    docket_intel = CourtDocketIntel()
    
    if not docket_intel.driver:
        print("Neo4j not configured. Skipping simulation.")
        return

    reasons = [
        "Counsel not available",
        "Personal difficulty of counsel",
        "Seeking time for filing counter affidavit",
        "Seeking time for filing rejoinder",
        "Awaiting service of notice",
        "Request for adjournment by petitioner",
        "Request for adjournment by respondent",
        "Court holiday / Strike",
        "Witness not present"
    ]
    
    lawyer_ids = [f"LAW-{i:03d}" for i in range(1, 21)]
    case_ids = [f"CASE-2024-{i:04d}" for i in range(1, 51)]
    
    print(f"Simulating {num_records} adjournment records...")
    
    for _ in range(num_records):
        lawyer_id = random.choice(lawyer_ids)
        case_id = random.choice(case_ids)
        party_type = random.choice(["Petitioner", "Respondent"])
        reason = random.choice(reasons)
        granted = random.random() > 0.1  # 90% chance of being granted
        
        # Random date in the last 6 months
        days_ago = random.randint(0, 180)
        date_obj = datetime.now() - timedelta(days=days_ago)
        date_str = date_obj.strftime("%Y-%m-%d")
        
        next_date_obj = date_obj + timedelta(days=random.randint(14, 60))
        next_date_str = next_date_obj.strftime("%Y-%m-%d") if granted else None
        
        record = AdjournmentRecord(
            case_id=case_id,
            lawyer_id=lawyer_id,
            party_type=party_type,
            reason=reason,
            granted=granted,
            date=date_str,
            next_date=next_date_str
        )
        
        docket_intel.log_adjournment(record)
        
    print("Simulation complete.")

if __name__ == "__main__":
    simulate_ecourts_data(200)
