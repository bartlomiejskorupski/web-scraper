import { Product } from './product';
import { LeroyScraper } from "./scraper/leroy-scraper";
import * as fs from 'fs';
import { AllegroScraper } from './scraper/allegro-scraper';
import { auditTime } from 'rxjs';

async function main() {
  const scraper = process.argv[2] === 'allegro' ? new AllegroScraper() : new LeroyScraper();

  const sub = scraper.progressObs
    .subscribe({
      next: (progress) => {
        console.clear();
        console.log();
        progress.status && console.log(progress.status);
        progress.donePercent && console.log(progress.donePercent.toFixed(2) + '%');
        progress.elemInfo && console.log(`Page: ${progress.elemInfo.elemNo}/${progress.elemInfo.outOf}`);
        console.log();
      },
      error: (err) => console.log(err),
      complete: () => {
        console.log('Done scraping "' + scraper.baseUrl + '"');
        sub.unsubscribe();
      }
    });
  
  const products = await scraper.scrapePage();

  console.log('Saving ' + products.length + ' products.');
  fs.writeFileSync('./out/out.json', JSON.stringify({"products": products}));
}

main();
