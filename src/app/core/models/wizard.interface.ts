import { ApiResponse } from "./api-response.interface";
import { School } from "./school.interface";

export enum WizardRole {
  Admin = 'admin',
  User = 'user',
}

export interface Wizard {
  id: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  role: WizardRole;
  deactivated: boolean;
  school: School | string;
}

export interface WizardRequest extends Partial<Wizard> {
  password: string;
}

export interface WizardResponse<T = Wizard> extends ApiResponse<T> {
  token?: string;
}
