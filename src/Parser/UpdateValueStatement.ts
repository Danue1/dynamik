import { NamedAttribute, QuotedAttribute } from "./Attribute";
import { ValueLiteral } from "./ValueLiteral";

export type UpdateValueStatement = SetStatement | RemoveStatement;

export class SetStatement {
  constructor(readonly attribute: NamedAttribute | QuotedAttribute, readonly value: ValueLiteral) {}
}

export class RemoveStatement {
  constructor(readonly attribute: NamedAttribute | QuotedAttribute) {}
}
