import { ApiResponse } from "./api-response.interface.js";

export interface Question {
  id: string;
  question: string;
  created_at: Date;
  options: string[];
}

export interface QuestionRequest extends Omit<Question, 'id' | 'created_at'> { }

export interface QuestionResponse<T = Question> extends ApiResponse<T> { }
