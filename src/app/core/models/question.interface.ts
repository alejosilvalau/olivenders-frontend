export interface Question {
  id: string;
  question: string;
  created_at: Date;
  options: string[];
}

export interface QuestionRequest extends Omit<Question, 'id' | 'created_at'> { }

export interface QuestionResponse<T = Question> {
  message: string;
  data?: T;
  total?: number;
  page?: number;
  pageSize?: number;
  errors?: { field: string; message: string }[];
}
