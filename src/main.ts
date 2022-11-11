import { Kosiarka } from './Kosiarka';
import { Fetcher } from "./Fetcher";
import * as fs from 'fs';

const fetcher: Fetcher = new Fetcher();

let kosiarki: Kosiarka[] = [];

const sub = fetcher.productsObs
  .subscribe({
    next: ({pageInfo, donePercent, products}) => {
      kosiarki = products;
      console.log('\n\n' + donePercent.toFixed(2) + '%');
      console.log(`Page: ${pageInfo.pageNo}/${pageInfo.outOf}`);
      console.log(`Number of found products: ${products.length}`);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {
      fs.writeFileSync('./out/out.json', JSON.stringify({"products": kosiarki}));
      console.log('Done.');
      sub.unsubscribe();
    }
  });

fetcher.scrapeWebsite();