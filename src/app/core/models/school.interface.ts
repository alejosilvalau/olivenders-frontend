import { ApiResponse } from "./api-response.interface.js";

export interface School {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface SchoolRequest extends Omit<School, 'id'> { }

export interface SchoolResponse<T = School> extends ApiResponse<T> { }
