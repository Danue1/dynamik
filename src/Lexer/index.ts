import { BooleanLiteral } from "./BooleanLiteral";
import { FloatLiteral } from "./FloatLiteral";
import { Identifier } from "./Identifier";
import { IntLiteral } from "./IntLiteral";
import { Keyword } from "./Keyword";
import { NullLiteral } from "./NullLiteral";
import { DoubleQuotedStringLiteral, SingleQuotedStringLiteral, StringLiteral } from "./StringLiteral";
import {
  ASTERISK,
  COLON,
  COMMA,
  DOT,
  EQ,
  LEFT_BRACE,
  LEFT_BRACKET,
  LEFT_CHEVRON,
  LEFT_CHEVRON_EQ,
  LEFT_CHEVRON_LEFT_CHEVRON,
  LEFT_CHEVRON_RIGHT_CHEVRON,
  LEFT_PARENS,
  MINUS,
  PERCENT,
  PLUS,
  RIGHT_BRACE,
  RIGHT_BRACKET,
  RIGHT_CHEVRON,
  RIGHT_CHEVRON_EQ,
  RIGHT_CHEVRON_RIGHT_CHEVRON,
  RIGHT_PARENS,
  SEMICOLON,
  SLASH,
  Symbol
} from "./Symbol";

export * from "./BooleanLiteral";
export * from "./FloatLiteral";
export * from "./Identifier";
export * from "./IntLiteral";
export * from "./Keyword";
export * from "./NullLiteral";
export * from "./StringLiteral";
export * from "./Symbol";

export class Lexer {
  private position = 0;

  constructor(private readonly source: string) {}

  lexAll(): readonly Token[] {
    this.position = 0;

    const tokenList = [];
    while (true) {
      this.skipIgnorable();
      if (!this.hasNext()) {
        break;
      }

      const token = this.lex();
      tokenList.push(token);
    }
    return tokenList;
  }

  private hasNext(): boolean {
    return this.position !== this.source.length;
  }

  private lex(): Token {
    switch (this.current()) {
      case "[": {
        this.consume();
        return LEFT_BRACKET;
      }
      case "]": {
        this.consume();
        return RIGHT_BRACKET;
      }
      case "(": {
        this.consume();
        return LEFT_PARENS;
      }
      case ")": {
        this.consume();
        return RIGHT_PARENS;
      }
      case "{": {
        this.consume();
        return LEFT_BRACE;
      }
      case "}": {
        this.consume();
        return RIGHT_BRACE;
      }
      case "<": {
        this.consume();
        switch (this.current()) {
          case "=": {
            this.consume();
            return LEFT_CHEVRON_EQ;
          }
          case "<": {
            this.consume();
            return LEFT_CHEVRON_LEFT_CHEVRON;
          }
          case ">": {
            this.consume();
            return LEFT_CHEVRON_RIGHT_CHEVRON;
          }
        }
        return LEFT_CHEVRON;
      }
      case ">": {
        this.consume();
        switch (this.current()) {
          case "=": {
            this.consume();
            return RIGHT_CHEVRON_EQ;
          }
          case ">": {
            this.consume();
            return RIGHT_CHEVRON_RIGHT_CHEVRON;
          }
        }
        return RIGHT_CHEVRON;
      }
      case "=": {
        this.consume();
        return EQ;
      }
      case ":": {
        this.consume();
        return COLON;
      }
      case ";": {
        this.consume();
        return SEMICOLON;
      }
      case ",": {
        this.consume();
        return COMMA;
      }
      case ".": {
        this.consume();
        return DOT;
      }
      case "+": {
        this.consume();
        return PLUS;
      }
      case "-": {
        this.consume();
        return MINUS;
      }
      case "*": {
        this.consume();
        return ASTERISK;
      }
      case "/": {
        this.consume();
        return SLASH;
      }
      case "%": {
        this.consume();
        return PERCENT;
      }
      case "'": {
        return this.lexSingleQuotedStringLiteral();
      }
      case '"': {
        return this.lexDoubleQuotedStringLiteral();
      }
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        return this.lexNumericLiteral();
      }
    }
    const identifier = this.lexIdentifier();
    return Keyword.from(identifier) ?? NullLiteral.from(identifier) ?? BooleanLiteral.from(identifier) ?? identifier;
  }

  private skipIgnorable(): void {
    while (true) {
      switch (this.current()) {
        case " ":
        case "\t":
        case "\r":
        case "\n": {
          this.consume();
          break;
        }
      }

      break;
    }
  }

  private lexSingleQuotedStringLiteral(): SingleQuotedStringLiteral {
    this.consume();
    const start = this.position;
    this.consumeWhile(char => !"'\r\n\t".includes(char));
    const end = this.position;
    this.consumeChar("'");
    return new SingleQuotedStringLiteral(this.source.slice(start, end));
  }

  private lexDoubleQuotedStringLiteral(): DoubleQuotedStringLiteral {
    this.consume();
    const start = this.position;
    this.consumeWhile(char => !'"\r\n\t'.includes(char));
    const end = this.position;
    this.consumeChar('"');
    return new DoubleQuotedStringLiteral(this.source.slice(start, end));
  }

  private lexNumericLiteral(): IntLiteral | FloatLiteral {
    const start = this.position;
    this.consumeWhile(char => "0123456789".includes(char));
    switch (this.current()) {
      case ".": {
        this.consume();
        this.consumeWhile(char => "0123456789".includes(char));
        const end = this.position;
        const token = this.source.slice(start, end);
        return new FloatLiteral(+token);
      }
      default: {
        const end = this.position;
        const token = this.source.slice(start, end);
        return new IntLiteral(+token);
      }
    }
  }

  private lexIdentifier(): Identifier {
    const start = this.position;
    this.consumeWhile(char => "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char));
    this.consumeWhile(char => "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(char));
    const end = this.position;
    const token = this.source.slice(start, end);
    return new Identifier(token);
  }

  private consumeChar(char: string): void {
    const current = this.current();
    if (current === char) {
      this.consume();
    } else {
      throw new Error(`Expected char "${char}", but find char "${current}".`);
    }
  }

  private consumeWhile(fn: (char: string) => boolean): void {
    while (this.hasNext()) {
      if (fn(this.current()!)) {
        this.consume();
      } else {
        break;
      }
    }
  }

  private consume(): void {
    this.position += 1;
  }

  private current(): null | string {
    return this.source[this.position] ?? null;
  }
}

export type Token = NullLiteral | BooleanLiteral | IntLiteral | FloatLiteral | StringLiteral | Symbol | Keyword | Identifier;
