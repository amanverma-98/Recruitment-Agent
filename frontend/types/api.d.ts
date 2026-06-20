// ──────────────────────────────────────────────
// Types derived directly from OpenAPI spec at
// https://recruitment-agent-2xst.onrender.com/openapi.json
// ──────────────────────────────────────────────

/** Matches `QuestionResponse` schema from the backend */
export interface QuestionResponse {
  id: string;
  topic: string;
  difficulty: string;
  question_type: string;        // "MCQ" | "Coding"
  question_text: string;
  options: string[];
  correct_option: number;       // index into `options[]`
  explanation?: string | null;
  ai_score?: number;
  status: string;               // "pending_review" | "approved" | "rejected" etc.
}

/** `POST /questions/generate` request body */
export interface GenerateQuestionRequest {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question_type: 'MCQ' | 'Coding';
}

/** `POST /questions/bulk-generate` request body */
export interface BulkGenerateRequest {
  topics: string[];
  difficulties: string[];
  count: number;
}

/** `POST /questions/bulk-generate` response */
export interface BulkGenerateResponse {
  generated: number;
  failed: number;
  question_ids: string[];
}

/** `PATCH /questions/{id}/status` request body */
export interface UpdateStatusRequest {
  status: string;
}

/** `PATCH /questions/{id}/review` request body */
export interface ReviewRequest {
  action: 'approve' | 'reject' | 'improve';
  feedback?: string[] | null;
}

/** `POST /questions/export/pdf` request body */
export interface ExportPdfRequest {
  question_ids?: string[] | null;
  status?: string | null;
}

/** `POST /questions/export/docx` request body */
export interface ExportDocxRequest {
  question_ids: string[];
}

export interface ExportQuesWithoutDetailPdfRequest {
  status: string;
  topic:string;
  difficulty:string;
  include_answers: boolean;
  include_explanations: boolean;
}




/** `DELETE /questions/` request body */
export interface DeleteQuestionsRequest {
  question_ids: string[];
}

/** `GET /analytics/` response */
export interface DashboardAnalytics {
  total_questions: number;
  approved: number;
  pending: number;
  rejected: number;
  needs_improvement?: number;
  avg_ai_score?: number;
  avg_iterations?: number;
}

/** `GET /analytics/logs` — actual GenerationLog model from backend */
export interface ActivityLog {
  id: string;
  user_id: string;
  topic: string;
  difficulty: string;
  question_id: string;
  score: number;
  iterations: number;
  created_at: string;
}

/** Validation error returned by FastAPI (422) */
export interface HTTPValidationError {
  detail: ValidationErrorItem[];
}

export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}
