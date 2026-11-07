import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.predictor_service import predictor_service
from app.services.dna_service import dna_service
from app.database import SessionLocal
from app.models.team_dna import TeamRuleRecord

client = TestClient(app)

def test_standout_feature_1_team_coding_dna():
    """
    Validates Standout Feature 1: Team Coding DNA.
    Verifies that the DNA profile contains multi-axis radar metrics,
    learned rules with confidence scores, and dynamic updates.
    """
    response = client.get("/api/dna/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["bank_id"] == "team-codemind"
    assert data["total_rules_learned"] >= 6
    assert data["bug_prevention_rate"] >= 90.0

    # Verify 6 core radar categories
    categories = [m["category"] for m in data["metrics"]]
    assert "Concurrency & Async Safety" in categories
    assert "Security & Secret Sanitization" in categories
    assert "Database & Query Isolation" in categories
    assert "Error Resilience & Exceptions" in categories

def test_standout_feature_2_memory_powered_comparison():
    """
    Validates Standout Feature 2: Memory-Powered Review Comparison.
    Verifies side-by-side A/B evaluation where Generic LLM misses critical
    organizational invariants while Hindsight-augmented review catches them.
    """
    sample_code = """
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    db.commit()
    return user
    """
    response = client.post("/api/reviews/compare", json={"code": sample_code, "language": "python"})
    assert response.status_code == 200
    data = response.json()

    generic = data["generic_review"]
    augmented = data["augmented_review"]

    # Generic review misses critical enterprise invariants
    assert generic["mode"] == "generic"
    assert generic["score"] >= 70

    # Augmented review identifies critical concurrency and commit violations
    assert augmented["mode"] == "augmented"
    assert any("Async Route DB Session Isolation" in r for r in data["rules_enforced"])
    assert "Hindsight Memory augmented" in data["memory_lift_summary"]
    assert len(augmented["items"]) > 0
    assert any(it["severity"] == "error" for it in augmented["items"])

def test_standout_feature_3_mistake_prediction_multi_patterns():
    """
    Validates Standout Feature 3: Mistake Prediction.
    Tests real-time pre-submit detection across multiple anti-patterns.
    """
    # 1. Concurrency anti-pattern
    p1 = predictor_service.predict("""
    async def fetch_user(db: Session = Depends(get_db)):
        return db.query(User).all()
    """)
    assert p1.detected is True
    assert p1.severity == "error"
    assert "Async Route" in p1.title

    # 2. Raw SQL injection
    p2 = predictor_service.predict("""
    def get_records(tenant_id: str):
        cursor.execute(f"SELECT * FROM records WHERE tenant = '{tenant_id}'")
    """)
    assert p2.detected is True
    assert p2.severity == "error"
    assert "SQL Interpolation" in p2.title

    # 3. Hardcoded secret
    p3 = predictor_service.predict("""
    JWT_SECRET = "supersecretproductiontoken12345"
    """)
    assert p3.detected is True
    assert p3.severity == "error"
    assert "Hardcoded Secret" in p3.title

    # 4. Bare except clause
    p4 = predictor_service.predict("""
    try:
        do_work()
    except:
        pass
    """)
    assert p4.detected is True
    assert p4.severity == "warning"
    assert "Bare Except" in p4.title

    # 5. Mutable default argument
    p5 = predictor_service.predict("""
    def process_queue(items, context={}):
        return True
    """)
    assert p5.detected is True
    assert p5.severity == "warning"
    assert "Mutable Default" in p5.title

    # 6. Outbound request without timeout
    p6 = predictor_service.predict("""
    response = httpx.get("https://api.external.com/v1/status")
    """)
    assert p6.detected is True
    assert p6.severity == "warning"
    assert "Missing Outbound Request Timeout" in p6.title

def test_continuous_learning_feedback_retention_loop():
    """
    Validates Continuous Learning Loop:
    Developer teaches a new convention -> Retained in Hindsight and DB ->
    Reflected in updated Team Profile and Stats.
    """
    new_mandate = "Always use orjson for JSON response serialization in high-throughput routes."
    payload = {
        "review_id": "rev-test-loop",
        "item_id": "item-loop-1",
        "action": "teach",
        "new_rule_content": new_mandate
    }

    # Step 1: Submit feedback
    resp_feedback = client.post("/api/feedback", json=payload)
    assert resp_feedback.status_code == 200
    assert resp_feedback.json()["success"] is True

    # Step 2: Check that Team DNA rules include the newly taught mandate
    resp_profile = client.get("/api/dna/profile")
    assert resp_profile.status_code == 200
    rules = resp_profile.json()["rules"]
    assert any(new_mandate in r["description"] for r in rules)

    # Step 3: Check updated stats
    resp_stats = client.get("/api/dna/stats")
    assert resp_stats.status_code == 200
    assert resp_stats.json()["bugs_prevented"] >= 90
