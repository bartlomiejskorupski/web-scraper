import { headers, sleep } from "../env";
import { Product } from "../product";
import { Observable, Subject } from "rxjs";
import * as cheerio from 'cheerio';
import { ScraperProgress, Scraper } from './scraper';
import * as fs from 'fs';

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
        const status = 'Status: ' + response.status + ' ' + response.statusText + '\nTrying again after 5s...';
        this.progress.next({status});
        await sleep(5000);
        continue;
      }
      const data = await response.text();

      productUrls.push(...this.findProductUrls(data));
      const pageInfo = this.getPageInfo(data);

      this.progress.next({
        status: 'Scraping product urls...',
        elemInfo: {
          elemNo: pageInfo.pageNo,
          outOf: pageInfo.outOf
        },
        donePercent: 100.0*(pageInfo.pageNo / pageInfo.outOf),
      });

      nextPageUrl = this.findNextPageUrl(data);
    }

    const products = await this.scrapeProductPages(productUrls);

    this.progress.complete();
    return products;
  }

  private async scrapeProductPages(urls: string[]): Promise<Product[]> {
    const products: Product[] = [];

    let i = 0;
    while(i < urls.length) {
      const url = urls[i];
      const res = await fetch(url);
      if(!res.ok) {
        const status = 'Status: ' + res.status + ' ' + res.statusText + '\nTrying again after 5s...';
        this.progress.next({status});
        await sleep(5000);
        continue;
      }
      const data = await res.text();

      products.push(this.scrapeProductPage(data));
      
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

  private scrapeProductPage(data: string): Product {
    const $ = cheerio.load(data);

    const imgHref = $('section.product-card.product-card-wrapper .product-gallery > .photo-container > a.product-big-photo.js-init-gallery > img.custom-attrs').first().attr('src');
    const imgFileName = imgHref.substring(imgHref.lastIndexOf('/') + 1);
    fetch(imgHref).then(this.downloadProductImage(imgFileName));

    const name = $('.product-description > .product-header > .product-title > h1').first().text().trim();
    const price = +$('.product-right-data > .product-buy-data > .prices-top > .product-price.size-big').attr('data-price');
    let description = $('#productTab .tab-content > .content > .product-info > span.description').first().text().trim();
    //description = description || undefined;
    let rating = +$('.product-description > .top-opinions > span.opinion-box > span.rating > span.value').first().text().trim().replace(',', '.');
    rating = rating || undefined;
    const attributes = this.getProductAttributes(data);

    return { name, price, rating, imgFileName, description, attributes };
  }

  private downloadProductImage = (imgFileName: string) => (res: Response) => {
    let ws: fs.WriteStream;
    res.body.pipeTo(new WritableStream({
      start: () => {
        ws = fs.createWriteStream('./out/images/' + imgFileName);
      },
      write: (chunk) => {
        ws.write(chunk);
      },
      close: () => {
        ws.close();
      }
    }));
  };

  private getProductAttributes(data: string): {[key: string]: string | number} {
    const $ = cheerio.load(data);

    const attrRows = $('#productTab .tab-content > .content > table.product-attributes-list > tbody')
      .children()
      .filter((i, el) => {
        return el.name === 'tr' 
          && $(el).hasClass('item-row')
          && !!$(el).find('td.item').first().text().trim()
      })
      .map((i, el) => {
        const key = $(el).find('td.item').first().text().trim();
        let value = $(el).find('td.value.item').first().text().trim();
        return { key, value };
      })
      .filter((i, attr) => attr.key !== 'Cena')
      .toArray();
    
    const attributes: {[key: string]: string | number} = {};
    attrRows.forEach((row) => attributes[row.key] = row.value);
    return attributes;
  }

  private getPageInfo(data: string): { pageNo: number, outOf: number} {
    const $ = cheerio.load(data);

    const pageNo = +$('.pagination.pagination-top > .paging span.tooltip-label').first().text().trim();
    const outOf = +$('.pagination.pagination-top > .paging > span.pages-count').first().text().trim();
    
    return { pageNo, outOf };
  }

  private findNextPageUrl(data: string): string {
    const $ = cheerio.load(data);

    const nextPageUrl = $('.paging > a.next').first().attr('href');
    
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
