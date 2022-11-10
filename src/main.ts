import { Kosiarka } from './Kosiarka';
import { Fetcher } from "./Fetcher";

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
    complete: () => {
      console.log('Done.');
      sub.unsubscribe();
    }
  });

fetcher.scrapeWebsite();