import { ScraperResult } from "./scraper/scraper";
import * as fs from 'fs';

const homeCategory = 'Strona główna';
const fieldSep = ';';
const mvSep = '|'; // Nie może być ',' bo nazwy kategorii go zawierają
const lineSep = '\n';

const catHeader = 'ID;Active (0/1);Name *;Parent category;Root category (0/1);Description;Meta title;Meta keywords;Meta description;URL rewritten;Image URL';

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
  const writeStream = fs.createWriteStream('./out/imports/import_kategorie_pl.csv', { flags: 'w' });

  writeStream.write(catHeader + lineSep);

  let id = '';

  Object.keys(result).forEach(key => {
    const row = {
      "ID": id,
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
        "ID": id,
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