import { NamedAttribute, QuotedAttribute } from "./Attribute";
import { ValueLiteral } from "./ValueLiteral";

export class Condition {
  constructor(readonly key: NamedAttribute | QuotedAttribute, readonly operator: ComparisonOperator, readonly value: ValueLiteral) {}
}

export enum ComparisonOperator {
  Eq,
  NotEq,
  LessThan,
  LessThanOrEq,
  GreaterThan,
  GreaterThanOrEq
}
