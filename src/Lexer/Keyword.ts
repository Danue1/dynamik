import { Identifier } from "./Identifier";

export class Keyword {
  static from(identifier: Identifier): null | Keyword {
    return KEYWORD[identifier.value.toUpperCase() as keyof typeof KEYWORD] ?? null;
  }

  constructor(readonly kind: KeywordKind) {}
}

export enum KeywordKind {
  Select, // SELECT
  Update, // UPDATE
  Insert, // INSERT
  Delete, // DELETE
  Set, // SET
  Remove, // REMOVE
  Into, // INTO
  Value, // VALUE
  From, // FROM
  Where, // WHERE
  And, // AND
  Or, // OR
  Order, // ORDER
  By, // BY
  Between, // BETWEEN
  In, // IN
  Is, // IS
  Not, // NOT
  DESC, // DESC
  ASC // ASC
}

export const SELECT = new Keyword(KeywordKind.Select);
export const UPDATE = new Keyword(KeywordKind.Update);
export const INSERT = new Keyword(KeywordKind.Insert);
export const DELETE = new Keyword(KeywordKind.Delete);
export const SET = new Keyword(KeywordKind.Set);
export const REMOVE = new Keyword(KeywordKind.Remove);
export const INTO = new Keyword(KeywordKind.Into);
export const VALUE = new Keyword(KeywordKind.Value);
export const FROM = new Keyword(KeywordKind.From);
export const WHERE = new Keyword(KeywordKind.Where);
export const AND = new Keyword(KeywordKind.And);
export const OR = new Keyword(KeywordKind.Or);
export const ORDER = new Keyword(KeywordKind.Order);
export const BY = new Keyword(KeywordKind.By);
export const BETWEEN = new Keyword(KeywordKind.Between);
export const IN = new Keyword(KeywordKind.In);
export const IS = new Keyword(KeywordKind.Is);
export const NOT = new Keyword(KeywordKind.Not);
export const DESC = new Keyword(KeywordKind.DESC);
export const ASC = new Keyword(KeywordKind.ASC);

const KEYWORD = {
  SELECT,
  UPDATE,
  INSERT,
  DELETE,
  SET,
  REMOVE,
  INTO,
  VALUE,
  FROM,
  WHERE,
  AND,
  OR,
  ORDER,
  BY,
  BETWEEN,
  IN,
  IS,
  NOT,
  DESC,
  ASC
};
