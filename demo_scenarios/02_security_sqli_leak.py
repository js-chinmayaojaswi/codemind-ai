# DEMO SCENARIO 2: SQL Injection Vulnerability & Hardcoded Secret
# Background: Flagged during SEC-2026-Q3 audit; team rule #102 mandates parameterized queries.

import psycopg2

# ❌ ANTI-PATTERN 1: Plaintext credential in source code
DATABASE_URL = "postgresql://svc_app:P@ssw0rd2026!@aurora-cluster.internal:5432/core"

def search_audit_logs(tenant_id: str, search_query: str):
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # ❌ ANTI-PATTERN 2: Formatted f-string SQL query directly executes arbitrary tenant injection
    raw_sql = f"SELECT log_id, timestamp, payload FROM audit_logs WHERE tenant = '{tenant_id}' AND payload LIKE '%{search_query}%'"
    cursor.execute(raw_sql)
    
    return cursor.fetchall()
