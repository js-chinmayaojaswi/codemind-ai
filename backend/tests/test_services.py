import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "CodeMind AI"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["active_bank_id"] == "team-codemind"

def test_mistake_prediction_pre_submit():
    # Anti-pattern: Async route with synchronous Session
    code = """
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    return user
    """
    response = client.post("/api/reviews/predict", json={"code": code, "language": "python"})
    assert response.status_code == 200
    data = response.json()
    assert data["detected"] is True
    assert "Async Route DB Session Isolation" in data["related_rule"]
    assert data["severity"] == "error"

def test_review_compare():
    code = """
@app.get("/items/{id}")
async def get_item(id: int, db: Session = Depends(get_db)):
    return db.query(Item).first()
    """
    response = client.post("/api/reviews/compare", json={"code": code, "language": "python"})
    assert response.status_code == 200
    data = response.json()
    assert "generic_review" in data
    assert "augmented_review" in data
    assert len(data["rules_enforced"]) > 0

def test_feedback_loop_retain():
    payload = {
        "review_id": "test-rev-101",
        "item_id": "item-1",
        "action": "teach",
        "new_rule_content": "Always specify timeout for httpx async requests."
    }
    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "retained" in data["message"]

def test_dna_profile():
    response = client.get("/api/dna/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["bank_id"] == "team-codemind"
    assert len(data["metrics"]) > 0
    assert len(data["rules"]) > 0

def test_dna_stats():
    response = client.get("/api/dna/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_reviews"] > 0
