import pandas as pd
import json
import uuid
import re
from datetime import datetime

# Input/Output paths
INPUT_FILE = "/Users/marcoscarvalho/Library/CloudStorage/Dropbox/_antigravity/void system v1.0/loveable/novo_relatrio_04-02-2026.xlsx"
OUTPUT_FILE = "src/infrastructure/database/seeds/clients_data.json"

def clean_phone(phone):
    if pd.isna(phone): return None
    return str(phone).replace('.0', '')

def clean_date(date_val):
    if pd.isna(date_val): return None
    if isinstance(date_val, datetime):
        return date_val.isoformat()
    return str(date_val)

def map_status_to_lifecycle(status):
    if pd.isna(status): return 'new'
    status = str(status).lower()
    mapping = {
        'ativo': 'active',
        'novo': 'new',
        'prospect': 'new',
        'ex-cliente': 'churned',
        'inativo': 'drifting',
        'vip': 'vip'
    }
    return mapping.get(status, 'new')

def main():
    print(f"Reading {INPUT_FILE}...")
    df = pd.read_excel(INPUT_FILE)
    
    clients = []
    
    for _, row in df.iterrows():
        # Generate ID or use consistent one? Generating UUID for now as DB uses text primary key
        # If we want to upsert based on email, we can let the seeder handle it.
        
        email = row['Email']
        if pd.isna(email) or '@' not in str(email):
            # fallback or skip? Let's skip invalid emails for safety or generate placeholder
            # For this strict import, skipping might be safer, but let's check count.
            # actually, let's generate a placeholder if name exists
            if pd.isna(row['Nome']): continue
            slug = str(row['Nome']).lower().replace(' ', '.')
            email = f"{slug}@missing.email"
        
        client = {
            "id": str(uuid.uuid4()),
            "fullName": row['Nome'],
            "email": str(email).strip(),
            "phone": clean_phone(row['Telefone']),
            "cpf": str(row['CPF']) if not pd.isna(row['CPF']) else None,
            "birthDate": clean_date(row['Nascimento']),
            "addressNeighborhood": str(row['Bairro']) if not pd.isna(row['Bairro']) else None,
            "addressCity": str(row['Cidade']) if not pd.isna(row['Cidade']) else None,
            "profession": str(row['Profissao']) if not pd.isna(row['Profissao']) else None,
            "leadSource": str(row['OrigemLead']) if not pd.isna(row['OrigemLead']) else None,
            "createdAt": clean_date(row['Criado em']),
            "updatedAt": clean_date(row['Atualizado em']),
            "lifeCycleStage": map_status_to_lifecycle(row['Status']),
            # Defaults
            "role": "client",
            "xp": 0,
            "totalSpent": 0,
            "totalSessions": 0,
            "sessionsFloat": 0,
            "sessionsMassage": 0,
            "sessionsCombo": 0
        }
        clients.append(client)
        
    print(f"Parsed {len(clients)} clients.")
    
    # Ensure directory exists
    import os
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(clients, f, indent=2, ensure_ascii=False)
    
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
