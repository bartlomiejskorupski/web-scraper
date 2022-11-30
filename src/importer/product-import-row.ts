// OPCJE
//
// Usuń wszystkie produkty przed importem: TAK
// Użyć indeksu produktu jako klucza: TAK
// Pomiń ponowne generowanie miniatur: NIE
// Wymuś wszystkie numery ID: TAK
// Wyślij e-mail z powiadomieniem: NIE
//


const FIELD_SEP = '|';
const MV_SEP = '$';

export class ProductImportRow {
  "ID" = '';
  "Aktywny (0 lub 1)" = '';
  "Nazwa" = '';
  "Kategorie (x,y,z...)" = '';
  "Cena bez podatku. (netto)" = '';
  "Cena zawiera podatek. (brutto)" = '';
  "ID reguły podatku" = '';
  "Koszt własny" = '';
  "W sprzedaży (0 lub 1)" = '';
  "Wartość rabatu" = '';
  "Procent rabatu" = '';
  "Rabat od dnia (rrrr-mm-dd)" = '';
  "Rabat do dnia (rrrr-mm-dd)" = '';
  "Indeks #" = '';
  "Kod dostawcy" = '';
  "Dostawca" = '';
  "Marka" = '';
  "kod EAN13" = '';
  "Kod kreskowy UPC" = '';
  "MPN" = '';
  "Podatek ekologiczny" = '';
  "Szerokość" = '';
  "Wysokość" = '';
  "Głębokość" = '';
  "Waga" = '';
  "Czas dostawy produktów dostępnych w magazynie:" = '';
  "Czas dostawy wyprzedanych produktów z możliwością rezerwacji:" = '';
  "Ilość" = '';
  "Minimalna ilość" = '';
  "Niski poziom produktów w magazynie" = '';
  "Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu" = '';
  "Widoczność" = '';
  "Dodatkowe koszty przesyłki" = '';
  "Jednostka dla ceny za jednostkę" = '';
  "Cena za jednostkę" = '';
  "Podsumowanie" = '';
  "Opis" = '';
  "Tagi (x,y,z...)" = '';
  "Meta-tytuł" = '';
  "Słowa kluczowe meta" = '';
  "Opis meta" = '';
  "Przepisany URL" = '';
  "Etykieta, gdy w magazynie" = '';
  "Etykieta kiedy dozwolone ponowne zamówienie" = '';
  "Dostępne do zamówienia (0 = Nie, 1 = Tak)" = '';
  "Data dostępności produktu" = '';
  "Data wytworzenia produktu" = '';
  "Pokaż cenę (0 = Nie, 1 = Tak)" = '';
  "Adresy URL zdjęcia (x,y,z...)" = '';
  "Tekst alternatywny dla zdjęć (x,y,z...)" = '';
  "Usuń istniejące zdjęcia (0 = Nie, 1 = Tak)" = '';
  "Cecha(Nazwa:Wartość:Pozycja:Indywidualne)" = '';
  "Dostępne tylko online (0 = Nie, 1 = Tak)" = '';
  "Stan:" = '';
  "Konfigurowalny (0 = Nie, 1 = Tak)" = '';
  "Można wgrywać pliki (0 = Nie, 1 = Tak)" = '';
  "Pola tekstowe (0 = Nie, 1 = Tak)" = '';
  "Akcja kiedy brak na stanie" = '';
  "Wirtualny produkt (0 = No, 1 = Yes)" = '';
  "Adres URL pliku" = '';
  "Ilość dozwolonych pobrań" = '';
  "Data wygaśnięcia (rrrr-mm-dd)" = '';
  "Liczba dni" = '';
  "ID / Nazwa sklepu" = '';
  "Zaawansowane zarządzanie magazynem" = '';
  "Zależny od stanu magazynowego" = '';
  "Magazyn" = '';
  "Akcesoria (x,y,z...)" = '';

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
  'ID',
  'Aktywny (0 lub 1)',
  'Nazwa',
  'Kategorie (x,y,z...)',
  'Cena bez podatku. (netto)',
  'ID reguły podatku',
  'Koszt własny',
  'W sprzedaży (0 lub 1)',
  'Wartość rabatu',
  'Procent rabatu',
  'Rabat od dnia (rrrr-mm-dd)',
  'Rabat do dnia (rrrr-mm-dd)',
  'Indeks #',
  'Kod dostawcy',
  'Dostawca',
  'Marka',
  'kod EAN13', 
  'Kod kreskowy UPC', 
  'MPN', 
  'Podatek ekologiczny', 
  'Szerokość', 
  'Wysokość', 
  'Głębokość', 
  'Waga', 
  'Czas dostawy produktów dostępnych w magazynie:', 
  'Czas dostawy wyprzedanych produktów z możliwością rezerwacji:', 
  'Ilość', 
  'Minimalna ilość', 
  'Niski poziom produktów w magazynie', 
  'Wyślij do mnie e-mail, gdy ilość jest poniżej tego poziomu', 
  'Widoczność', 
  'Dodatkowe koszty przesyłki', 
  'Jednostka dla ceny za jednostkę', 
  'Cena za jednostkę', 
  'Podsumowanie', 
  'Opis', 
  'Tagi (x,y,z...)', 
  'Meta-tytuł', 
  'Słowa kluczowe meta', 
  'Opis meta', 
  'Przepisany URL', 
  'Etykieta, gdy w magazynie', 
  'Etykieta kiedy dozwolone ponowne zamówienie', 
  'Dostępne do zamówienia (0 = Nie, 1 = Tak)', 
  'Data dostępności produktu', 
  'Data wytworzenia produktu', 
  'Pokaż cenę (0 = Nie, 1 = Tak)', 
  'Adresy URL zdjęcia (x,y,z...)', 
  'Tekst alternatywny dla zdjęć (x,y,z...)', 
  'Usuń istniejące zdjęcia (0 = Nie, 1 = Tak)', 
  'Cecha(Nazwa:Wartość:Pozycja:Indywidualne)', 
  'Dostępne tylko online (0 = Nie, 1 = Tak)', 
  'Stan:', 
  'Konfigurowalny (0 = Nie, 1 = Tak)', 
  'Można wgrywać pliki (0 = Nie, 1 = Tak)', 
  'Pola tekstowe (0 = Nie, 1 = Tak)', 
  'Akcja kiedy brak na stanie', 
  'Wirtualny produkt (0 = No, 1 = Yes)', 
  'Adres URL pliku', 
  'Ilość dozwolonych pobrań', 
  'Data wygaśnięcia (rrrr-mm-dd)', 
  'Liczba dni', 
  'ID / Nazwa sklepu', 
  'Zaawansowane zarządzanie magazynem', 
  'Zależny od stanu magazynowego', 
  'Magazyn', 
  'Akcesoria (x,y,z...)', 
  'Cena zawiera podatek. (brutto)'
];
