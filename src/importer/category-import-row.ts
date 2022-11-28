export class CategoryImportRow {
  "ID" = '';
  "Active (0/1)" = '';
  "Name *" = '';
  "Parent category" = '';
  "Root category (0/1)" = '';
  "Description" = '';
  "Meta title" = '';
  "Meta keywords" = '';
  "Meta description" = '';
  "URL rewritten" = '';
  "Image URL" = '';

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

const FIELD_SEP = ';';
const MV_SEP = '|';

const HEADERS = [
  'ID',
  'Active (0/1)',
  'Name *',
  'Parent category',
  'Root category (0/1)',
  'Description',
  'Meta title',
  'Meta keywords',
  'Meta description',
  'URL rewritten',
  'Image URL'
];
