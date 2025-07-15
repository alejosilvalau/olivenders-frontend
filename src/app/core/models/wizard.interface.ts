export enum WizardRole {
  Admin = 'admin',
  User = 'user',
}

export interface Wizard {
  id: string;
  username: string;
  password: string;
  name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  role: WizardRole;
  deactivated: boolean;
  school: string;
}

export interface LoginResponse {
  message: string;
  data: {
    wizard: Wizard;
    token: string;
  };
}
