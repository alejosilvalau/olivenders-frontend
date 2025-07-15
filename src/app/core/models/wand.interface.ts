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
  wood: string;
  core: string;
  order?: string;
}
