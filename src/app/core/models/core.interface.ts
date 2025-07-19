import { ApiResponse } from "./api-response.interface.js";

export interface Core {
  id: string;
  name: string;
  description: string;
  price: string;
}

export interface CoreRequest extends Omit<Core, 'id'> { }

export interface CoreResponse<T = Core> extends ApiResponse<T> { }
