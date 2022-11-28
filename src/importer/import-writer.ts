import { ScraperResult } from '../scraper/scraper';
import * as fs from 'fs';
import { formatDate } from '../utils';
import { ProductImportRow } from './product-import-row';
import { CategoryImportRow } from './category-import-row';
import { Product } from '../product';

const LINE_SEP = '\n';

export const writeImports = (result: ScraperResult) => {
  writeCategories(result);
  writeProducts(result);
}

const writeProducts = (result: ScraperResult) => {
  const fieldSep = ProductImportRow.getFieldSep();
  const mvSep = ProductImportRow.getMvSep();
  const prodHeaders = ProductImportRow.getHeaders();
  const writeStream = fs.createWriteStream('./out/imports/import_produkty_pl.csv', { flags: 'w' });
  
  writeStream.write(prodHeaders.join(fieldSep) + LINE_SEP);

  const prodInfos = Object.keys(result).flatMap(category => {
    return Object.keys(result[category]).flatMap(subcategory => {
      return result[category][subcategory].map(product => {
        return { category, subcategory, product };
      });
    });
  });

  for(const prodInfo of prodInfos) {
    const prod = prodInfo.product;
    const row = new ProductImportRow();
    row['Aktywny (0 lub 1)'] = '1';
    row['Nazwa'] = prod.name;
    row['Kategorie (x,y,z...)'] = prodInfo.subcategory;
    row['Cena zawiera podatek. (brutto)'] = prod.price+'';
    row['ID reguły podatku'] = '1';
    row['W sprzedaży (0 lub 1)'] = '1';
    row['Indeks #'] = prod.attributes['Numer referencyjny'] ?? '';
    row['Kod dostawcy'] = '';
    row['Dostawca'] = '';
    row['Marka'] = prod.attributes['Marka produktu'] ?? '';
    row['kod EAN13'] = prod.attributes['Kod EAN'] ?? '';
    row['Podatek ekologiczny'] = '0';
    row['Szerokość'] = prod.attributes['Szerokość (w cm)'] ?? '';
    row['Wysokość'] = prod.attributes['Wysokość (w cm)'] ?? '';
    row['Głębokość'] = prod.attributes['Głębokość (w cm)'] ?? '';
    row['Waga'] = prod.attributes['Waga (w kg)'] ?? '';
    row['Ilość'] = '299';
    row['Minimalna ilość'] = '1';
    row['Niski poziom produktów w magazynie'] = '0';
    row['Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu'] = '0';
    row['Podsumowanie'] = '<b>Testowe podsumowanie</b>';
    row['Opis'] = prod.description;
    row['Etykieta, gdy w magazynie'] = 'W magazynie';
    row['Etykieta kiedy dozwolone ponowne zamówienie'] = 'Dozwolone ponowne zamówienie';
    row['Dostępne do zamówienia (0 = Nie, 1 = Tak)'] = '1';
    row['Data dostępności produktu'] = formatDate(new Date());
    row['Data wytworzenia produktu'] = formatDate(new Date());
    row['Pokaż cenę (0 = Nie, 1 = Tak)'] = '1';
    row['Adresy URL zdjęcia (x,y,z...)'] = prod.imgFileName;
    row['Tekst alternatywny dla zdjęć (x,y,z...)'] = 'Zdjęcie pozycji';
    row['Usuń istniejące zdjęcia (0 = Nie, 1 = Tak)'] = '1';
    row['Cecha(Nazwa:Wartość:Pozycja:Indywidualne)'] = createAttributeString(prod);
    row['Dostępne tylko online (0 = Nie, 1 = Tak)'] = '1';
    row['Stan:'] = 'new';
    row['Konfigurowalny (0 = Nie, 1 = Tak)'] = '0';
    row['Można wgrywać pliki (0 = Nie, 1 = Tak)'] = '0'; //
    row['Pola tekstowe (0 = Nie, 1 = Tak)'] = '0';
    row['Akcja kiedy brak na stanie'] = '0';
    row['Wirtualny produkt (0 = No, 1 = Yes)'] = '0';
    row['Adres URL pliku'] = ''; //
    row['Ilość dozwolonych pobrań'] = ''; // ??
    row['Data wygaśnięcia (rrrr-mm-dd)'] = '';
    row['ID / Nazwa sklepu'] = '0';
    row['Zaawansowane zarządzanie magazynem'] = '0';
    row['Zależny od stanu magazynowego'] = '0';
    row['Magazyn'] = '0';

    const rowStr = prodHeaders.map(header => row[header] || '').join(fieldSep);
    writeStream.write(rowStr + LINE_SEP);
  }

}

const createAttributeString = (prod: Product): string => {
  const attr = prod.attributes;

  const attrString = Object.keys(attr)
    .map(key => key.replaceAll(':', '-')+':'+attr[key].replaceAll(':', '-'))
    .join(ProductImportRow.getMvSep());

  return attrString;
};

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