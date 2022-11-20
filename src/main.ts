import { Product } from './product';
import { LeroyScraper } from "./scraper/leroy-scraper";
import * as fs from 'fs';
import { auditTime } from 'rxjs';

async function main() {
  const scraper = new LeroyScraper();

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
  
  const result = await scraper.scrapeWebsite();

  console.log("Saving results.");
  fs.writeFileSync('./out/out.json', JSON.stringify(result));
};

main();
