export type Severity = 'error' | 'warning' | 'info' | 'suggestion';

export interface ReviewItem {
  id: string;
  line_start: number;
  line_end: number;
  severity: Severity;
  category: 'architecture' | 'security' | 'performance' | 'style' | 'concurrency';
  title: string;
  message: string;
  suggestion?: string;
  rule_citation?: string;
  memory_origin?: string; // Citation from Hindsight memory bank
  confidence: number;
}

export interface ReviewResult {
  id: string;
  mode: 'generic' | 'augmented';
  summary: string;
  score: number; // 0 - 100 quality score
  items: ReviewItem[];
  recalled_memories_count?: number;
  execution_time_ms: number;
  created_at: string;
}

export interface ReviewComparisonData {
  generic_review: ReviewResult;
  augmented_review: ReviewResult;
  memory_lift_summary: string;
  rules_enforced: string[];
}

export interface MistakePrediction {
  detected: boolean;
  title: string;
  explanation: string;
  historical_occurrences: number;
  prevention_tip: string;
  severity: 'warning' | 'error' | 'info';
  related_rule?: string;
}

export interface TeamRule {
  id: string;
  rule_name: string;
  description: string;
  category: string;
  confidence_score: number;
  frequency_applied: number;
  created_at: string;
  source: 'developer_feedback' | 'pr_retention' | 'explicit_seed';
}

export interface TeamDnaMetric {
  category: string;
  score: number;
  fullMark: number;
}

export interface TeamProfile {
  team_name: string;
  bank_id: string;
  total_rules_learned: number;
  bug_prevention_rate: number;
  metrics: TeamDnaMetric[];
  rules: TeamRule[];
}

export interface StatsSummary {
  total_reviews: number;
  active_rules: number;
  precision_rate: number;
  bugs_prevented: number;
}

export interface FeedbackSubmission {
  review_id: string;
  item_id: string;
  action: 'accept' | 'reject' | 'teach';
  rejection_reason?: string;
  new_rule_content?: string;
}
