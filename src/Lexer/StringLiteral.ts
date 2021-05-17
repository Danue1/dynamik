export type StringLiteral = SingleQuotedStringLiteral | DoubleQuotedStringLiteral;

export class SingleQuotedStringLiteral {
  constructor(readonly value: string) {}
}

export class DoubleQuotedStringLiteral {
  constructor(readonly value: string) {}
}
