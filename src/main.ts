import { Product } from './product';
import { LeroyScraper } from "./scraper/leroy-scraper";
import * as fs from 'fs';
import { auditTime } from 'rxjs';
import { writeImports } from './importer/import-writer';
import { ScraperResult } from './scraper/scraper';

const runScraper = async (): Promise<ScraperResult> => {
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
  return result;
} 

async function main() {
  if(!fs.existsSync('./out/images')) {
    fs.mkdirSync('./out/images', {recursive: true});
  }
  if(!fs.existsSync('./out/imports')) {
    fs.mkdirSync('./out/imports', {recursive: true});
  }

  let result: ScraperResult;
  if(process.argv.length > 2 && process.argv[2] === 'imports' && fs.existsSync('./out/out.json')){
    result = JSON.parse(fs.readFileSync('./out/out.json').toString());
  }
  else {
    result = await runScraper();

    console.log("Saving results.");
    fs.writeFileSync('./out/out.json', JSON.stringify(result));
  }

  console.log('Writing imports.');
  writeImports(result);
};

main();
