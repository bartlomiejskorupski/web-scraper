import { Observable } from "rxjs";
import { Product } from "../product";

export interface ScraperProgress {
  pageInfo: {
    pageNo: number,
    outOf: number
  };
  donePercent: number;
  products: Product[];
}

export interface Scraper {
  readonly baseUrl: string;
  readonly progressObs: Observable<ScraperProgress>
  scrapePage: () => Promise<Product[]>;
}