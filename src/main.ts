import { Product } from './product';
import { LeroyScraper } from "./scraper/leroy-scraper";
import * as fs from 'fs';
import { Scraper } from './scraper/scraper';
import { AllegroScraper } from './scraper/allegro-scraper';

const scraper = process.argv[2] === 'leroy' ? new LeroyScraper() : new AllegroScraper();

const sub = scraper.progressObs
  .subscribe({
    next: ({pageInfo, donePercent, products}) => {
      console.log('\n' + donePercent.toFixed(2) + '%');
      console.log(`Page: ${pageInfo.pageNo}/${pageInfo.outOf}`);
      console.log(`Number of found products: ${products.length}\n`);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {
      console.log('Done.');
      sub.unsubscribe();
    }
  });

scraper.scrapePage()
  .then((products) => {
    //fs.writeFileSync('./out/out.json', JSON.stringify({"products": products}));
  });