import { ApiResponse } from "./api-response.interface";
import { Quiz } from "./quiz.interface";
import { Wand } from "./wand.interface";
import { Wizard } from "./wizard.interface";

export interface Answer {
  id: string;
  created_at: Date;
  score: number;
  quiz: Quiz | string;
  wizard: Wizard | string;
  wand: Wand | string;
}

export interface AnswerRequest extends Omit<Answer, 'id' | 'created_at' | 'wand'> { }

export interface AnswerResponse<T = Answer> extends ApiResponse<T> { }
