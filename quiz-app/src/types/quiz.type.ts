export interface TestDTO {
  id: number;
  title: string;
  name?: string; // Tên cũ
  description: string;
  time: number;
  category: string;
}

export interface QuestionDTO {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string; // "A", "B", "C", "D"
}

export interface TestDetailResponse {
  testDTO: TestDTO;
  questions: QuestionDTO[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage?: number;
  pageable?: any;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
}

export interface TestResult {
  id: number;
  testId: number;
  userId: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
}

export interface QuestionResponseInput {
  questionId: number;
  selectedOption: string;
}

export interface SubmitTestPayload {
  testId: number;
  userId: number;
  responses: QuestionResponseInput[];
}
