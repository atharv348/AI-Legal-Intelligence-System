import json
import os
from neo4j import GraphDatabase
import sys

# Add backend to path to import settings
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.core.config import settings

def load_mapping_to_neo4j(mapping_file):
    if not settings.NEO4J_URI:
        print("Neo4j not configured in .env")
        return

    with open(mapping_file, 'r') as f:
        data = json.load(f)

    driver = GraphDatabase.driver(
        settings.NEO4J_URI, 
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )

    with driver.session() as session:
        for entry in data['mappings']:
            query = """
            MERGE (s:LawSection {law: $source_law, section: $source_section})
            MERGE (t:LawSection {law: $target_law, section: $target_section})
            CREATE (s)-[:RELATES_TO {
                relationship: $relationship,
                description: $description
            }]->(t)
            """
            session.run(query, **entry)
            print(f"Mapped {entry['source_law']} Sec {entry['source_section']} to {entry['target_law']} Sec {entry['target_section']}")

    driver.close()
    print("Legal Knowledge Graph updated in Neo4j.")

if __name__ == "__main__":
    mapping_path = os.path.join(os.path.dirname(__file__), 'legal_knowledge_graph_mapping.json')
    load_mapping_to_neo4j(mapping_path)
