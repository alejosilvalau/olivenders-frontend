import { ApiResponse } from "./api-response.interface";

export interface School {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface SchoolRequest extends Omit<School, 'id'> { }

export interface SchoolResponse<T = School> extends ApiResponse<T> { }
