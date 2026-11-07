from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.feedback import FeedbackCreate, FeedbackResponse, FeedbackAuditRecord
from app.models.team_dna import TeamRuleRecord
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse)
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    """
    Continuous Learning Loop:
    Developer feedback triggers an explicit Hindsight retain() operation,
    persisting new conventions, reinforcing accepted rules, or noting exceptions.
    """
    memory_content = ""
    assigned_tags = ["code-review"]

    if payload.action == "teach" and payload.new_rule_content:
        memory_content = f"Team Mandate: {payload.new_rule_content}"
        assigned_tags.extend(["team-mandate", "explicit-seed", "architecture"])
        
        # Add to local rules table
        new_rule = TeamRuleRecord(
            rule_name=payload.new_rule_content[:45] + ("..." if len(payload.new_rule_content) > 45 else ""),
            description=payload.new_rule_content,
            category="Architecture",
            confidence_score=95,
            frequency_applied=1,
            source="developer_feedback"
        )
        db.add(new_rule)
        db.commit()

    elif payload.action == "reject" and payload.rejection_reason:
        memory_content = f"Rule Exception/Clarification: In review {payload.review_id}, finding {payload.item_id} was rejected with reason: '{payload.rejection_reason}'"
        assigned_tags.extend(["exception", "rejected-suggestion"])

    elif payload.action == "accept":
        memory_content = f"Rule Reinforced: Finding {payload.item_id} was validated and accepted by developer."
        assigned_tags.extend(["accepted-precedent", "reinforcement"])

        # Reinforce existing rule if it matches
        first_rule = db.query(TeamRuleRecord).first()
        if first_rule:
            first_rule.frequency_applied += 1
            first_rule.confidence_score = min(100, first_rule.confidence_score + 1)
            db.commit()

    # Call official Hindsight retain primitive
    hindsight_result = hindsight_service.retain_memory(
        content=memory_content or f"Feedback {payload.action} on item {payload.item_id}",
        context="Developer Continuous Learning Feedback",
        tags=assigned_tags,
        metadata={"review_id": payload.review_id, "action": payload.action}
    )

    # Log to audit DB
    audit = FeedbackAuditRecord(
        review_id=payload.review_id,
        item_id=payload.item_id,
        action=payload.action,
        rejection_reason=payload.rejection_reason,
        new_rule_content=payload.new_rule_content,
        hindsight_memory_id=hindsight_result.get("memory_id"),
        status="retained"
    )
    db.add(audit)
    db.commit()

    return FeedbackResponse(
        success=True,
        memory_id=hindsight_result.get("memory_id"),
        action=payload.action,
        message=f"Feedback recorded and retained into Hindsight bank '{hindsight_service.bank_id}'."
    )
