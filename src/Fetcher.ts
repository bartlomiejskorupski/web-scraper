import { baseUrl, url, headers } from "./env";
import { Kosiarka } from "./Kosiarka";
import { Subject } from "rxjs";
import * as cheerio from 'cheerio';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ScraperResponse {
  pageInfo: {
    pageNo: number,
    outOf: number
  };
  donePercent: number;
  products: Kosiarka[];
}

export class Fetcher {

  private productsSubject = new Subject<ScraperResponse>();
  productsObs = this.productsSubject.asObservable();

  async scrapeWebsite() {
    let nextPageUrl = url;

    const products: Kosiarka[] = [];

    while(nextPageUrl) {
      const response = await fetch(nextPageUrl, { headers });
      if(!response.ok) {
        this.productsSubject.error(new Error('Error fetching website'));
        break;
      }
      const data = await response.text();

      const foundProducts = this.findProducts(data);
      products.push(...foundProducts);

      const pageInfo = this.getPageInfo(data);
      const donePercent = 100.0*(pageInfo.pageNo / pageInfo.outOf);

      this.productsSubject.next({pageInfo, donePercent, products});

      nextPageUrl = this.findNextPageUrl(data);
      await sleep(1000);
    }

    this.productsSubject.complete();
  }

  private getPageInfo(data: string): { pageNo: number, outOf: number} {
    const $ = cheerio.load(data);

    const paginationElement = $('.paging > .current-page');
    const pageNo = +paginationElement.find('span.tooltip-label').first().text().trim();
    const outOf = +paginationElement.attr('data-pages');
    // console.log(`Found page info: ${ pageNo }/${ outOf }`);
    
    return { pageNo, outOf };
  }

  private findNextPageUrl(data: string): string {
    const $ = cheerio.load(data);

    const nextPageUrl = $('.paging > a.next').first().attr('href');
    //console.log('Found next page url: "' + nextPageUrl + '"');
    
    return nextPageUrl === '#' ? '' : baseUrl + nextPageUrl;
  }
  
  private findProducts(data: string): Kosiarka[] {
    const $ = cheerio.load(data);
  
    const products = $('.product-list').children()
      .map(function (i, el) {
        const name = $(this).find('.title').text().trim();
        const integer: string = $(this).find('.integer').first().text().trim();
        const fractional: string = $(this).find('.fractional').first().text().trim();
        
        let price: string | number = integer + fractional;
        price = +price.replace(',', '.').replace(/\s+/g, '');
  
        const kosiarka: Kosiarka = { 
          name: name,
          price: price
        }
        return kosiarka
      })
      .toArray()
      .filter((o: { name: string }) => !!(o.name));
      
      return products;
  }

}

