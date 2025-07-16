import { ApiResponse } from "./api-response.interface.js";
import { Core } from "./core.interface.js";
import { Wood } from "./wood.interface.js";

export enum WandStatus {
  Available = 'available',
  Sold = 'sold',
  Deactivated = 'deactivated',
}

export interface Wand {
  id: string;
  name: string;
  length_inches: number;
  description: string;
  status: WandStatus;
  image: string;
  profit: number;
  total_price: number;
  wood: Wood | string;
  core: Core | string;
}

export interface WandRequest extends Omit<Wand, 'id'> { }

export interface WandResponse<T = Wand> extends ApiResponse<T> { }
