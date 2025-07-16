export interface Core {
  id: number;
  name: string;
  description: string;
  price: string;
}

export interface CoreRequest extends Omit<Core, 'id'> { }

export interface CoreResponse<T = Core> {
  message: string;
  data?: T;
  total?: number;
  page?: number;
  pageSize?: number;
  errors?: { field: string; message: string }[];
}
