import { Product } from './product';
import { LeroyScraper } from "./scraper/leroy-scraper";
import * as fs from 'fs';
import { Scraper } from './scraper/scraper';
import { AllegroScraper } from './scraper/allegro-scraper';

async function main() {
  const scraper = process.argv[2] === 'leroy' ? new LeroyScraper() : new AllegroScraper();

  const sub = scraper.progressObs
    .subscribe({
      next: (progress) => {
        progress.status && console.log('\n' + progress.status);
        progress.donePercent && console.log(progress.donePercent.toFixed(2) + '%');
        progress.elemInfo && console.log(`Page: ${progress.elemInfo.elemNo}/${progress.elemInfo.outOf}\n`);
      },
      error: (err) => console.log(err),
      complete: () => {
        console.log('Done scraping "' + scraper.baseUrl + '"');
        sub.unsubscribe();
      }
    });
  
  const products = await scraper.scrapePage()

  console.log('Saving ' + products.length + ' products.');
  fs.writeFileSync('./out/out.json', JSON.stringify({"products": products}));
}

await main();