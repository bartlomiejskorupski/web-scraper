// OPCJE
//
// Usuń wszystkie kombinacje przed importem: TAK
// Użyć indeksu produktu jako klucza: TAK
// Wyślij e-mail z powiadomieniem: NIE
//

const FIELD_SEP = '|';
const MV_SEP = '$';

export class CombinationImportRow {
  "Identyfikator Produktu (ID)" = '';
  "Indeks produktu" = '';
  "Atrybut (Nazwa:Typ:Pozycja)*" = '';
  "Wartość (Wartość:Pozycja)*" = '';
  "Identyfikator dostawcy" = '';
  "Indeks" = '';
  "kod EAN13" = '';
  "Kod kreskowy UPC" = '';
  "MPN" = '';
  "Koszt własny" = '';
  "Wpływ na cenę" = '';
  "Podatek ekologiczny" = '';
  "Ilość" = '';
  "Minimalna ilość" = '';
  "Niski poziom produktów w magazynie" = '';
  "Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu" = '';
  "Wpływ na wagę" = '';
  "Domyślny (0 = Nie, 1 = Tak)" = '';
  "Data dostępności kombinacji" = '';
  "Wybierz z pośród zdjęć produktów wg pozycji (1,2,3...)" = '';
  "Adresy URL zdjęcia (x,y,z...)" = '';
  "Tekst alternatywny dla zdjęć (x,y,z...)" = '';
  "ID / Nazwa sklepu" = '';
  "Zaawansowane zarządzanie magazynem" = '';
  "Zależny od stanu magazynowego" = '';
  "Magazyn" = '';

  constructor() {}

  public static getHeaders() {
    return [...HEADERS];
  }


  public static getFieldSep() {
    return FIELD_SEP;
  }

  public static getMvSep() {
    return MV_SEP;
  }

}

const HEADERS = [
  "Identyfikator Produktu (ID)",
  "Indeks produktu",
  "Atrybut (Nazwa:Typ:Pozycja)*",
  "Wartość (Wartość:Pozycja)*",
  "Identyfikator dostawcy",
  "Indeks",
  "kod EAN13",
  "Kod kreskowy UPC",
  "MPN",
  "Koszt własny",
  "Wpływ na cenę",
  "Podatek ekologiczny",
  "Ilość",
  "Minimalna ilość",
  "Niski poziom produktów w magazynie",
  "Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu",
  "Wpływ na wagę",
  "Domyślny (0 = Nie, 1 = Tak)",
  "Data dostępności kombinacji",
  "Wybierz z pośród zdjęć produktów wg pozycji (1,2,3...)",
  "Adresy URL zdjęcia (x,y,z...)",
  "Tekst alternatywny dla zdjęć (x,y,z...)",
  "ID / Nazwa sklepu",
  "Zaawansowane zarządzanie magazynem",
  "Zależny od stanu magazynowego",
  "Magazyn",
];
