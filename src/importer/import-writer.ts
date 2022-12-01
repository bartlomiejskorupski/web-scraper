import { ScraperResult } from '../scraper/scraper';
import * as fs from 'fs';
import { formatDate } from '../utils';
import { ProductImportRow } from './product-import-row';
import { CategoryImportRow } from './category-import-row';
import { Product } from '../product';
import { CombinationImportRow } from './combination-import-row';

const LINE_SEP = '\n';

export const writeImports = (result: ScraperResult) => {
  writeCategories(result);
  writeProducts(result);
}


const writeProducts = (result: ScraperResult) => {
  const fieldSep = ProductImportRow.getFieldSep();
  const mvSep = ProductImportRow.getMvSep();
  const prodHeaders = ProductImportRow.getHeaders();
  const combHeaders = CombinationImportRow.getHeaders();

  const writeStream = fs.createWriteStream('./out/imports/import_produkty_pl.csv', { flags: 'w' });
  const combWriteStream = fs.createWriteStream('./out/imports/import_kombinacje_pl.csv', { flags: 'w' });

  writeStream.write(prodHeaders.join(fieldSep) + LINE_SEP);
  combWriteStream.write(combHeaders.join(fieldSep) + LINE_SEP);

  const prodInfos = Object.keys(result).flatMap(category => {
    return Object.keys(result[category]).flatMap(subcategory => {
      return result[category][subcategory].map(product => {
        return { category, subcategory, product };
      });
    });
  });

  let idCounter = 1;
  for(const prodInfo of prodInfos) {
    const prodRow = productToRow(prodInfo.product, prodInfo.category, prodInfo.subcategory, idCounter);
    const combRows = productToCombinations(prodInfo.product, prodInfo.category, prodInfo.subcategory, idCounter);

    const rowStr = prodHeaders.map(header => prodRow[header] || '').join(fieldSep);
    writeStream.write(rowStr + LINE_SEP);

    for(const combRow of combRows) {
      const combRowStr = combHeaders.map(header => combRow[header] || '').join(fieldSep);
      combWriteStream.write(combRowStr + LINE_SEP);
    }

    idCounter++;
  }

}

const productToCombinations = (prod: Product, category: string, subcategory, id: number): CombinationImportRow[] => {
  const warranty = {
    name: 'Gwarancja (W latach)',
    type: 'radio',
    selections: [
      { value: '1', multiplier: 0, default: '1'},
      { value: '2', multiplier: 0.1, default: '0' },
      { value: '3', multiplier: 0.15, default: '0'}
    ]
  };

  const combRows = warranty.selections.map(select => {
    const row = new CombinationImportRow();
    row['Identyfikator Produktu (ID)'] = ''+id;
    row['Indeks produktu'] = ''+id;
    //row['kod EAN13'] = prod.attributes['Kod EAN:'];
    row['Indeks'] = id+'-'+select.value;
    row['Atrybut (Nazwa:Typ:Pozycja)*'] = [warranty.name, warranty.type, '0'].join(':');
    row['Wartość (Wartość:Pozycja)*'] = [select.value, '0'].join(':');
    row['Wpływ na cenę'] = ''+((+prod.price)*select.multiplier).toFixed(2);
    row['Podatek ekologiczny'] = '0';
    row['Ilość'] = '500'; // ?
    row['Minimalna ilość'] = '1';
    row['Wpływ na wagę'] = '0';
    row['Domyślny (0 = Nie, 1 = Tak)'] = select.default;
    row['ID / Nazwa sklepu'] = '0';
    row['Zaawansowane zarządzanie magazynem'] = '0';
    row['Magazyn'] = '0';
    row['Zależny od stanu magazynowego'] = '0';
    row['Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu'] = '0';
    row['Wybierz z pośród zdjęć produktów wg pozycji (1,2,3...)'] = '1';
    //row['Adresy URL zdjęcia (x,y,z...)'] = prod.imgFileName;
    //row['Tekst alternatywny dla zdjęć (x,y,z...)'] = prod.name;

    return row;
  });

  return combRows;
}

const productToRow = (prod: Product, category: string, subcategory, id: number): ProductImportRow => {
  const row = new ProductImportRow();
  row['ID'] = ''+(id);
  row['Aktywny (0 lub 1)'] = '1';
  row['Nazwa'] = prod.name;
  row['Kategorie (x,y,z...)'] = subcategory; // ?
  row['Cena zawiera podatek. (brutto)'] = prod.price+'';
  row['ID reguły podatku'] = '1';
  row['W sprzedaży (0 lub 1)'] = '0';
  //row['Indeks #'] = prod.attributes['Numer referencyjny:'];
  row['Indeks #'] = ''+id;
  row['Kod dostawcy'] = '';
  row['Dostawca'] = '';
  row['Marka'] = prod.attributes['Marka produktu'];
  row['kod EAN13'] = prod.attributes['Kod EAN:'];
  row['Podatek ekologiczny'] = '0';
  row['Szerokość'] = prod.attributes['Szerokość (w cm)'];
  row['Wysokość'] = prod.attributes['Wysokość (w cm)'];
  row['Głębokość'] = prod.attributes['Głębokość (w cm)'];
  row['Waga'] = prod.attributes['Waga (w kg)'];
  row['Ilość'] = '500';
  row['Minimalna ilość'] = '1';
  row['Niski poziom produktów w magazynie'] = '0';
  row['Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu'] = '0';
  row['Podsumowanie'] = createSummaryString(prod);
  row['Opis'] = prod.description;
  row['Etykieta, gdy w magazynie'] = 'W magazynie';
  row['Etykieta kiedy dozwolone ponowne zamówienie'] = 'Ponowne zamówienie dozwolone';
  row['Dostępne do zamówienia (0 = Nie, 1 = Tak)'] = '1';
  row['Data dostępności produktu'] = ''; //
  row['Data wytworzenia produktu'] = formatDate(new Date());
  row['Pokaż cenę (0 = Nie, 1 = Tak)'] = '1';
  row['Adresy URL zdjęcia (x,y,z...)'] = prod.imgFileName;
  row['Tekst alternatywny dla zdjęć (x,y,z...)'] = prod.name;
  row['Usuń istniejące zdjęcia (0 = Nie, 1 = Tak)'] = '1';
  row['Cecha(Nazwa:Wartość:Pozycja:Indywidualne)'] = createFeatureString(prod);
  row['Dostępne tylko online (0 = Nie, 1 = Tak)'] = '0';
  row['Stan:'] = 'new';
  row['Konfigurowalny (0 = Nie, 1 = Tak)'] = '0';
  row['Można wgrywać pliki (0 = Nie, 1 = Tak)'] = '0';
  row['Pola tekstowe (0 = Nie, 1 = Tak)'] = '0';
  row['Akcja kiedy brak na stanie'] = '0';
  row['Wirtualny produkt (0 = No, 1 = Yes)'] = '0';
  row['Adres URL pliku'] = '';
  row['Ilość dozwolonych pobrań'] = '';
  row['Data wygaśnięcia (rrrr-mm-dd)'] = '';
  row['ID / Nazwa sklepu'] = '0';
  row['Zaawansowane zarządzanie magazynem'] = '0';
  row['Zależny od stanu magazynowego'] = '0';
  row['Magazyn'] = '0';
  return row;
}

const createFeatureString = (prod: Product): string => {
  const ignored = ['Numer referencyjny:', 'Marka produktu', 'Kod EAN:', 'Szerokość (w cm)', 'Wysokość (w cm)', 'Głębokość (w cm)', 'Waga (w kg)', 'Gwarancja (w latach)'];

  const attr = prod.attributes;

  const fieldLimit = 255;
  let featuresLength = 0;
  let removedFeatures = 0;
  let position = 0;
  const attrString = Object.keys(attr)
    .filter(key => !ignored.includes(key))
    .map(key => {
      const name = key.replaceAll(':', ''); // Usuń ':'
      const value = attr[key].replaceAll(':', ' '); // Zamień na spację
      return [name, value].join(':');
    })
    .sort((a , b) => a.length - b.length)
    .map(feature => {
      return [feature, ''+(position++), '0'].join(':');
    })
    .filter(feature => {
      //console.log(feature);
      if((featuresLength + feature.length + 1) <= fieldLimit) {
        featuresLength = featuresLength + feature.length + 1;
        return true;
      }
      removedFeatures = removedFeatures + 1;
      return false;
    })
    .join(ProductImportRow.getMvSep());

  // if(removedFeatures) {
  //   console.log('\n'+prod.name);
  //   console.log('Removed features:', removedFeatures);
  // }

  return attrString;
};

const createSummaryString = (prod: Product): string => {
  const summaryAttrs = ['Marka produktu', 'Grubość (w mm)', 'Szerokość (w cm)', 'Wysokość (w cm)', 'Głębokość (w cm)', 'Waga (w kg)']
  let summary = '';
  for(const attr of summaryAttrs) {
    if(prod.attributes[attr]) {
      summary = summary + '<p>' + attr + ': ' + prod.attributes[attr] + '</p>';
    }
  }
  return summary;
}

const writeCategories = (result: ScraperResult) => {
  const homeCategory = 'Strona główna';
  const fieldSep = CategoryImportRow.getFieldSep();
  const mvSep = CategoryImportRow.getMvSep();
  const catHeader = CategoryImportRow.getHeaders();


  const writeStream = fs.createWriteStream('./out/imports/import_kategorie_pl.csv', { flags: 'w' });

  writeStream.write(catHeader.join(fieldSep) + LINE_SEP);

  Object.keys(result).forEach(catName => {
    const row = new CategoryImportRow();
    row['ID'] = '';
    row['Active (0/1)'] = '1';
    row['Name *'] = catName;
    row['Parent category'] = homeCategory;
    row['Root category (0/1)'] = '0';
    row['Description'] = 'Wszystkie ' + catName + ' dostępne w naszym sklepie.';
    row['Meta title'] = '';
    row['Meta keywords'] = '';
    row['Meta description'] = '';
    row['URL rewritten'] = '';
    row['Image URL'] = '';

    writeStream.write(Object.values(row).join(fieldSep) + LINE_SEP);
  })

  for(const catName in result) {    
    for(const subCatName in result[catName]) {
      const row = new CategoryImportRow();
      row['ID'] = '';
      row['Active (0/1)'] = '1';
      row['Name *'] = subCatName;
      row['Parent category'] = catName;
      row['Root category (0/1)'] = '0';
      row['Description'] = 'Wszystkie ' + subCatName + ' dostępne w naszym sklepie.';
      row['Meta title'] = '';
      row['Meta keywords'] = '';
      row['Meta description'] = '';
      row['URL rewritten'] = '';
      row['Image URL'] = '';
      writeStream.write(Object.values(row).join(fieldSep) + LINE_SEP);
    }
  }
}