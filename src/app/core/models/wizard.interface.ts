import { School } from "./school.interface.js";

export enum WizardRole {
  Admin = 'admin',
  User = 'user',
}

export interface Wizard {
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

export interface WizardResponse<T = Wizard> {
  message: string;
  data?: T;
  token?: string;
}
