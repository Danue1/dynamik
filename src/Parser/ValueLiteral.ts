export type ValueLiteral =
  | ValueNullLiteral
  | ValueBooleanLiteral
  | ValueIntLiteral
  | ValueFloatLiteral
  | ValueStringLiteral
  | ValueObjectLiteral
  | readonly ValueLiteral[];

export class ValueNullLiteral {}

export class ValueBooleanLiteral {
  constructor(readonly value: boolean) {}
}

export class ValueIntLiteral {
  constructor(readonly value: number) {}
}

export class ValueFloatLiteral {
  constructor(readonly value: number) {}
}

export class ValueStringLiteral {
  constructor(readonly value: string) {}
}

export class ValueObjectLiteral {
  constructor(readonly value: Record<string, ValueLiteral>) {}
}
