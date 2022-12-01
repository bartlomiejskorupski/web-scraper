export interface Product {
  name?: string;
  price?: number;
  imgFileName?: string;
  rating?: number;
  description?: string;
  attributes?: {
    [key: string]: string;
  };
};