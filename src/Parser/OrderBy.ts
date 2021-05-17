import { NamedAttribute, QuotedAttribute } from "./Attribute";

export class OrderBy {
  constructor(readonly attribute: NamedAttribute | QuotedAttribute, readonly direction: Direction) {}
}

export enum Direction {
  Asc = "ASC",
  Desc = "DESC"
}
