import { Observable, Subject } from 'rxjs';
import { headers, sleep } from '../env';
import { Product } from '../product';
import { Scraper, ScraperProgress } from './scraper';
import * as fs from 'fs';
import * as cheerio from 'cheerio';

export class AllegroScraper implements Scraper {
  private progress = new Subject<ScraperProgress>;
  readonly progressObs = this.progress.asObservable(); 
  
  readonly baseUrl = 'https://allegro.pl';
  private startUrl = 'https://allegro.pl/kategoria/narzedzia-ogrodnicze-kosiarki-85196';

  async scrapePage(): Promise<Product[]> {
    const hrefs: string[] = [];

    let pageNo = 1;
    let nextPageUrl = this.startUrl;
    while(nextPageUrl) {
      const data = await this.fetchPage(nextPageUrl);
      
      hrefs.push(...this.findProductUrls(data));
      console.log('Length: ' + hrefs.length);

      const maxPageNo = this.findMaxPageNo(data);
      const donePercent = 100.0*(pageNo / maxPageNo)/2.0;

      this.progress.next({
        elemInfo: {
          elemNo: pageNo, 
          outOf: maxPageNo
        }, 
        donePercent, 
        products: []
      });

      if(pageNo !== maxPageNo) {
        nextPageUrl = this.startUrl + `?p=${pageNo + 1}`;
      }
      else {
        nextPageUrl = '';
      }
      console.log('Next page url: "' + nextPageUrl + '"');
      
      console.log('Waiting 3s...');
      await sleep(3000);
    }

    return [];
  };

  private findProductUrls(data: string): string[] {
    const $ = cheerio.load(data);

    let articles = $('.opbox-listing section').children()
      .filter((i, el) => el.name === 'article');
    
    const hrefs = articles.map((i, el) => {
      return $(el).find('a._w7z6o._uj8z7.meqh_en.mpof_z0.mqu1_16.m6ax_n4._6a66d_LX75-')
        .first()
        .attr('href');
    }).toArray();

    return hrefs;
  }

  private findMaxPageNo(data: string): number {
    const $ = cheerio.load(data);

    const pageComp = $('.mpof_ki._6d89c_32b3B.m7f5_6m.m7f5_sf_s > .mpof_ki.m3h2_16._6d89c_14wVQ.mt1t_fz.munh_16.munh_56_s > .mpof_ki.m389_6m > input');
    
    return +pageComp.attr('data-maxpage').trim();
  }

  private async fetchPage(url: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let data;
      while(true) {
        const res = await fetch(url, { headers });
        data = await res.text();
        //fs.writeFileSync('./out/test.html', data);
  
        console.log('Status: ' + res.status + ' ' + res.statusText);
  
        if(res.ok){
          console.log('Successfull fetch of "' + url + '"');
          break;
        }
  
        console.log('Dupa, aplikacja przekroczyła limit zapytań.');
        await sleep(10000);
      }
      resolve(data);
    });
  
  }

}