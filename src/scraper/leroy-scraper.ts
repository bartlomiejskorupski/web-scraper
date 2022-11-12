import { headers, sleep } from "../env";
import { Product } from "../product";
import { Observable, Subject } from "rxjs";
import * as cheerio from 'cheerio';
import { ScraperProgress, Scraper } from './scraper';

export class LeroyScraper implements Scraper{
  private progress = new Subject<ScraperProgress>();
  readonly progressObs = this.progress.asObservable();

  readonly baseUrl = 'https://www.leroymerlin.pl';
  private startUrl = 'https://www.leroymerlin.pl/maszyny-ogrodnicze/kosiarki-traktorki-roboty-koszace,a28.html';

  async scrapePage() {
    const products: Product[] = [];

    let nextPageUrl = this.startUrl;
    while(nextPageUrl) {
      const response = await fetch(nextPageUrl, { headers });
      if(!response.ok) {
        this.progress.error(new Error('Error fetching website'));
        break;
      }
      const data = await response.text();

      const foundProducts = this.findProducts(data);
      products.push(...foundProducts);

      const pageInfo = this.getPageInfo(data);
      const donePercent = 100.0*(pageInfo.pageNo / pageInfo.outOf);

      this.progress.next({pageInfo, donePercent, products});

      nextPageUrl = this.findNextPageUrl(data);
      await sleep(100);
    }

    this.progress.complete();
    return products;
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
    
    return nextPageUrl === '#' ? '' : this.baseUrl + nextPageUrl;
  }
  
  private findProducts(data: string): Product[] {
    const $ = cheerio.load(data);
  
    const products: Product[] = $('.product-list').children()
      .map(function (i, el) {
        const name = $(this).find('.title').text().trim();
        const integer: string = $(this).find('.integer').first().text().trim();
        const fractional: string = $(this).find('.fractional').first().text().trim();
        
        let price: string | number = integer + fractional;
        price = +price.replace(',', '.').replace(/\s+/g, '');
  
        return {
          name: name,
          price: price
        };
      })
      .toArray()
      .filter((o: { name: string }) => !!(o.name));
      
      return products;
  }

}

