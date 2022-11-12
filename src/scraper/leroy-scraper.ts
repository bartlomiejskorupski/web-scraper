import { headers, sleep } from "../env";
import { Product } from "../product";
import { Observable, Subject } from "rxjs";
import * as cheerio from 'cheerio';
import { ScraperProgress, Scraper } from './scraper';
import * as fs from 'fs';
import stream from 'node:stream';

export class LeroyScraper implements Scraper {
  private progress = new Subject<ScraperProgress>();
  readonly progressObs = this.progress.asObservable();

  readonly baseUrl = 'https://www.leroymerlin.pl';
  private startUrl = 'https://www.leroymerlin.pl/maszyny-ogrodnicze/kosiarki-traktorki-roboty-koszace,a28.html';

  async scrapePage(): Promise<Product[]> {
    const productUrls: string[] = [];

    let nextPageUrl = this.startUrl;
    while(nextPageUrl) {
      const response = await fetch(nextPageUrl, { headers });
      
      if(!response.ok) {
        console.log('Status: ' + response.status + ' ' + response.statusText);
        console.log('Trying again after 5s...');
        await sleep(5000);
        continue;
      }
      const data = await response.text();

      productUrls.push(...this.findProductUrls(data));

      const pageInfo = this.getPageInfo(data);
      const donePercent = 100.0*(pageInfo.pageNo / pageInfo.outOf);

      const status = 'Scraping products urls...';
      this.progress.next({
        status,
        elemInfo: {
          elemNo: pageInfo.pageNo,
          outOf: pageInfo.outOf
        },
        donePercent
      });

      nextPageUrl = this.findNextPageUrl(data);
    }

    console.log(productUrls[productUrls.length - 1]);
    

    const products = await this.scrapeProductPage(productUrls);

    this.progress.complete();
    return products;
  }

  private async scrapeProductPage(urls: string[]): Promise<Product[]> {
    const products: Product[] = [];

    let i = 0;
    while(i < urls.length) {
      const url = urls[i];
      const res = await fetch(url);
      if(!res.ok) {
        console.log('Status: ' + res.status + ' ' + res.statusText);
        console.log('Trying again after 5s...');
        await sleep(5000);
        continue;
      }
      const data = await res.text();
      const $ = cheerio.load(data);

      const imgHref = $('section.product-card.product-card-wrapper .product-gallery > .photo-container > a.product-big-photo.js-init-gallery > img.custom-attrs').first().attr('src');
      const imgFileName = imgHref.substring(imgHref.lastIndexOf('/') + 1);
      fetch(imgHref)
        .then(res => {
          let ws: fs.WriteStream;
          res.body.pipeTo(new WritableStream({
            start: () => {
              ws = fs.createWriteStream('./out/images/' + imgFileName);
              //console.log('Opening stream for "' + imgHref + '"');
            },
            write: (chunk) => {
              ws.write(chunk);
            },
            close: () => {
              ws.close();
              //console.log('Closing stream for "' + imgHref + '"');
            }
          }));
        });

      const name = $('.product-description > .product-header > .product-title > h1')
        .first().text().trim();
      
      const price = +$('.product-right-data > .product-buy-data > .prices-top > .product-price.size-big').attr('data-price');

      products.push({ name, price, imgFileName });
      
      this.progress.next({
        status: 'Scraping product info...',
        elemInfo: {
          elemNo: i,
          outOf: urls.length
        },
        donePercent: 100.0*(i/urls.length)
      });
      i = i + 1;
    }

    return products;
  }

  private getPageInfo(data: string): { pageNo: number, outOf: number} {
    const $ = cheerio.load(data);

    const pageNo = +$('.pagination.pagination-top > .paging span.tooltip-label').first().text().trim();
    const outOf = +$('.pagination.pagination-top > .paging > span.pages-count').first().text().trim();
    //console.log(`Found page info: ${ pageNo }/${ outOf }`);
    
    return { pageNo, outOf };
  }

  private findNextPageUrl(data: string): string {
    const $ = cheerio.load(data);

    const nextPageUrl = $('.paging > a.next').first().attr('href');
    //console.log('Found next page url: "' + nextPageUrl + '"');
    
    return nextPageUrl === '#' ? '' : this.baseUrl + nextPageUrl;
  }
  
  private findProductUrls(data: string): string[] {
    const $ = cheerio.load(data);
  
    const urls: string[] = $('#product-listing > .product > a.url')
      .map((i, el) => $(el).attr('href'))
      .filter((i, href) => href !== '#')
      .map((i, href) => this.baseUrl + href)
      .toArray();
      
    return urls;
  }



}

