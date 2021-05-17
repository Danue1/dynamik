import { Identifier } from "./Identifier";

export class BooleanLiteral {
  static from(identifier: Identifier): null | BooleanLiteral {
    switch (identifier.value.toLowerCase()) {
      case "true": {
        return TRUE;
      }
      case "false": {
        return FALSE;
      }
    }
    return null;
  }

  constructor(readonly value: boolean) {}
}

export const TRUE = new BooleanLiteral(true);
export const FALSE = new BooleanLiteral(false);
