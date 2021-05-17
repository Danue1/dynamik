export type Attribute = WildcardAttribute | NamedAttribute | QuotedAttribute;

export class WildcardAttribute {}

export const WILDCARD = new WildcardAttribute();

export class NamedAttribute {
  constructor(readonly value: string) {}
}

export class QuotedAttribute {
  constructor(readonly value: string) {}
}
