export interface Wood {
  id: string;
  name: string;
  binomial_name: string;
  description: string;
  price: number;
}

export interface WoodRequest extends Omit<Wood, 'id'> { }

export interface WoodResponse<T = Wood> {
  message: string;
  data?: T;
}
