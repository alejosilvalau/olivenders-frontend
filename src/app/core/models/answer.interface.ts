import { ApiResponse } from "./api-response.interface.js";
import { Quiz } from "./quiz.interface.js";
import { Wand } from "./wand.interface.js";
import { Wizard } from "./wizard.interface.js";

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
