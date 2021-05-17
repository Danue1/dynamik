import { Identifier } from "./Identifier";

export class NullLiteral {
  static from(identifier: Identifier): null | NullLiteral {
    if (identifier.value.toLocaleLowerCase() === "null") {
      return NULL;
    }
    return null;
  }
}

export const NULL = new NullLiteral();
