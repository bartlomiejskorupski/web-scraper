export interface Product {
  name?: string;
  price?: number;
  imgFileName?: string;
  rating?: number;
  attributes?: { [name: string]: string };
};