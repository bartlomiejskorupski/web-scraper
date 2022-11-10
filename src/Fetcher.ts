import { url, headers } from "./env";
import { Kosiarka } from "./Kosiarka";
import { Observable, Subject } from "rxjs";
import * as cheerio from 'cheerio';

export class Fetcher {

  private products: Kosiarka[] = [];
  private productsSubject = new Subject<Kosiarka[]>();
  productsObs = this.productsSubject.asObservable();

  constructor() { }

  fetchWebsite() {
    fetch(url, { headers })
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      this.fetchSuccessful(data);
      this.productsSubject.next(this.products);
    });
  }
  
  findNextPage(data): string {
    return '';
  }
  
  fetchSuccessful(data) {
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
    
      this.products = [...this.products, ...products];
  
    console.log(this.products);
  }

}

