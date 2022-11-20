import { Observable } from "rxjs";
import { Product } from "../product";

export interface Category {
  [subcategory: string]: Product[];
}

export interface ScraperResult {
  [category: string]: Category;
}

export interface ScraperProgress {
  status?: string;
  elemInfo?: {
    elemNo: number,
    outOf: number
  };
  donePercent?: number;
  products?: Product[];
}

export interface Scraper {
  readonly baseUrl: string;
  readonly progressObs: Observable<ScraperProgress>
  scrapeWebsite: () => Promise<ScraperResult>;
}