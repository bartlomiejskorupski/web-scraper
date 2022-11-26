import { ScraperResult } from "./scraper/scraper";
import * as fs from 'fs';

const homeCategory = 'Strona główna';
const lineSep = '\n';

const catHeader = 'ID;Active (0/1);Name *;Parent category;Root category (0/1);Description;Meta title;Meta keywords;Meta description;URL rewritten;Image URL';
const prodHeaders = ['ID', 'Aktywny (0 lub 1)', 'Nazwa', 'Kategorie (x,y,z...)', 'Cena bez podatku. (netto)', 'Cena zawiera podatek. (brutto)', 'ID reguły podatku', 'Koszt własny', 'W sprzedaży (0 lub 1)', 'Wartość rabatu', 'Procent rabatu', 'Rabat od dnia (rrrr-mm-dd)', 'Rabat do dnia (rrrr-mm-dd)', 'Indeks #', 'Kod dostawcy', 'Dostawca', 'Marka', 'kod EAN13', 'Kod kreskowy UPC', 'MPN', 'Podatek ekologiczny', 'Szerokość', 'Wysokość', 'Głębokość', 'Waga', 'Czas dostawy produktów dostępnych w magazynie:', 'Czas dostawy wyprzedanych produktów z możliwością rezerwacji:', 'Ilość', 'Minimalna ilość', 'Niski poziom produktów w magazynie', 'Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu', 'Widoczność', 'Dodatkowe koszty przesyłki', 'Jednostka dla ceny za jednostkę', 'Cena za jednostkę', 'Podsumowanie', 'Opis', 'Tagi (x,y,z...)', 'Meta-tytuł', 'Słowa kluczowe meta', 'Opis meta', 'Przepisany URL', 'Etykieta, gdy w magazynie', 'Etykieta kiedy dozwolone ponowne zamówienie', 'Dostępne do zamówienia (0 = Nie, 1 = Tak)', 'Data dostępności produktu', 'Data wytworzenia produktu', 'Pokaż cenę (0 = Nie, 1 = Tak)', 'Adresy URL zdjęcia (x,y,z...)', 'Tekst alternatywny dla zdjęć (x,y,z...)', 'Usuń istniejące zdjęcia (0 = Nie, 1 = Tak)', 'Cecha(Nazwa:Wartość:Pozycja:Indywidualne)', 'Dostępne tylko online (0 = Nie, 1 = Tak)', 'Stan:', 'Konfigurowalny (0 = Nie, 1 = Tak)', 'Można wgrywać pliki (0 = Nie, 1 = Tak)', 'Pola tekstowe (0 = Nie, 1 = Tak)', 'Akcja kiedy brak na stanie', 'Wirtualny produkt (0 = No, 1 = Yes)', 'Adres URL pliku', 'Ilość dozwolonych pobrań', 'Data wygaśnięcia (rrrr-mm-dd)', 'Liczba dni', 'ID / Nazwa sklepu', 'Zaawansowane zarządzanie magazynem', 'Zależny od stanu magazynowego', 'Magazyn', 'Akcesoria (x,y,z...)']

interface ProductImportRow {
  "ID"?: string;
  "Aktywny (0 lub 1)"?: string;
  "Nazwa"?: string;
  "Kategorie (x,y,z...)"?: string;
  "Cena bez podatku. (netto)"?: string;
  "Cena zawiera podatek. (brutto)"?: string;
  "ID reguły podatku"?: string;
  "Koszt własny"?: string;
  "W sprzedaży (0 lub 1)"?: string;
  "Wartość rabatu"?: string;
  "Procent rabatu"?: string;
  "Rabat od dnia (rrrr-mm-dd)"?: string;
  "Rabat do dnia (rrrr-mm-dd)"?: string;
  "Indeks #"?: string;
  "Kod dostawcy"?: string;
  "Dostawca"?: string;
  "Marka"?: string;
  "kod EAN13"?: string;
  "Kod kreskowy UPC"?: string;
  "MPN"?: string;
  "Podatek ekologiczny"?: string;
  "Szerokość"?: string;
  "Wysokość"?: string;
  "Głębokość"?: string;
  "Waga"?: string;
  "Czas dostawy produktów dostępnych w magazynie:"?: string;
  "Czas dostawy wyprzedanych produktów z możliwością rezerwacji:"?: string;
  "Ilość"?: string;
  "Minimalna ilość"?: string;
  "Niski poziom produktów w magazynie"?: string;
  "Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu"?: string;
  "Widoczność"?: string;
  "Dodatkowe koszty przesyłki"?: string;
  "Jednostka dla ceny za jednostkę"?: string;
  "Cena za jednostkę"?: string;
  "Podsumowanie"?: string;
  "Opis"?: string;
  "Tagi (x,y,z...)"?: string;
  "Meta-tytuł"?: string;
  "Słowa kluczowe meta"?: string;
  "Opis meta"?: string;
  "Przepisany URL"?: string;
  "Etykieta, gdy w magazynie"?: string;
  "Etykieta kiedy dozwolone ponowne zamówienie"?: string;
  "Dostępne do zamówienia (0 = Nie, 1 = Tak)"?: string;
  "Data dostępności produktu"?: string;
  "Data wytworzenia produktu"?: string;
  "Pokaż cenę (0 = Nie, 1 = Tak)"?: string;
  "Adresy URL zdjęcia (x,y,z...)"?: string;
  "Tekst alternatywny dla zdjęć (x,y,z...)"?: string;
  "Usuń istniejące zdjęcia (0 = Nie, 1 = Tak)"?: string;
  "Cecha(Nazwa:Wartość:Pozycja:Indywidualne)"?: string;
  "Dostępne tylko online (0 = Nie, 1 = Tak)"?: string;
  "Stan:"?: string;
  "Konfigurowalny (0 = Nie, 1 = Tak)"?: string;
  "Można wgrywać pliki (0 = Nie, 1 = Tak)"?: string;
  "Pola tekstowe (0 = Nie, 1 = Tak)"?: string;
  "Akcja kiedy brak na stanie"?: string;
  "Wirtualny produkt (0 = No, 1 = Yes)"?: string;
  "Adres URL pliku"?: string;
  "Ilość dozwolonych pobrań"?: string;
  "Data wygaśnięcia (rrrr-mm-dd)"?: string;
  "Liczba dni"?: string;
  "ID / Nazwa sklepu"?: string;
  "Zaawansowane zarządzanie magazynem"?: string;
  "Zależny od stanu magazynowego"?: string;
  "Magazyn"?: string;
  "Akcesoria (x,y,z...)"?: string;
}

interface CategoryImportRow {
  "ID": string;
  "Active (0/1)": string;
  "Name *": string;
  "Parent category": string;
  "Root category (0/1)": string;
  "Description": string;
  "Meta title": string;
  "Meta keywords": string;
  "Meta description": string;
  "URL rewritten": string;
  "Image URL": string;
}

export const writeImports = (result: ScraperResult) => {
  writeCategories(result);
  writeProducts(result);
}

const writeProducts = (result: ScraperResult) => {
  const fieldSep = '|';
  const mvSep = '$'; // CURSED

  const writeStream = fs.createWriteStream('./out/imports/import_produkty_pl.csv', { flags: 'w' });
  
  writeStream.write(prodHeaders.join(fieldSep) + lineSep);

  for(const catName in result) {
    for(const subCatName in result[catName]) {
      const products = result[catName][subCatName];
      for(const prod of products) {
        const row: ProductImportRow = {
          "Aktywny (0 lub 1)": '1',
          "Nazwa": prod.name,
          "Kategorie (x,y,z...)": [catName, subCatName].join(mvSep),
        };

        const rowStr = prodHeaders.map(header => row[header] || '').join(fieldSep);
        writeStream.write(rowStr + lineSep);
      }
    }
  }
}

const writeCategories = (result: ScraperResult) => {
  const fieldSep = ';';
  const mvSep = '|'; // Nie może być ',' bo nazwy kategorii go zawierają


  const writeStream = fs.createWriteStream('./out/imports/import_kategorie_pl.csv', { flags: 'w' });

  writeStream.write(catHeader + lineSep);

  Object.keys(result).forEach(key => {
    const row = {
      "ID": '',
      "Active (0/1)": '1',
      "Name *": key,
      "Parent category": homeCategory,
      "Root category (0/1)": '0',
      "Descriptin": 'Wszystkie ' + key + ' dostępne w naszym sklepie.',
      "Meta title": '',
      "Meta keywords": '',
      "Meta description": '',
      "URL rewritten": '',
      "Image URL": ''
    }

    writeStream.write(Object.values(row).join(fieldSep) + lineSep);
  })

  for(const catName in result) {    
    for(const subCatName in result[catName]) {
      const row = {
        "ID": '',
        "Active (0/1)": '1',
        "Name *": subCatName,
        "Parent category": catName,
        "Root category (0/1)": '0',
        "Descriptin": 'Wszystkie ' + subCatName + ' dostępne w naszym sklepie.',
        "Meta title": '',
        "Meta keywords": '',
        "Meta description": '',
        "URL rewritten": '',
        "Image URL": ''
      }
      writeStream.write(Object.values(row).join(fieldSep) + lineSep);
    }
  }
}