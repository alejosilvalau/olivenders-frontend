import { ApiResponse } from "./api-response.interface";
import { Question } from "./question.interface";

export interface Quiz {
  id: string;
  name: string;
  created_at: Date;
  questions: Question[] | string[];
}

export interface QuizRequest extends Omit<Quiz, 'id' | 'created_at'> { }

export interface QuizResponse<T = Quiz> extends ApiResponse<T> { }
