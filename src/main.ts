import { take } from "rxjs";
import { Kosiarka } from "./Kosiarka";
import { Fetcher } from "./Fetcher";

const fetcher: Fetcher = new Fetcher();

let kosiarki: Kosiarka[];

fetcher.productsObs
  .pipe(take(1))
  .subscribe((products: Kosiarka[]) => {
    kosiarki = products;
    console.log(kosiarki);
  });

fetcher.fetchWebsite();