import chai from "chai";
import { FALSE, TRUE } from "./BooleanLiteral";
import { FloatLiteral } from "./FloatLiteral";
import { Lexer, Token } from "./index";
import { IntLiteral } from "./IntLiteral";
import {
  AND,
  ASC,
  BETWEEN,
  BY,
  DELETE,
  DESC,
  FROM,
  IN,
  INSERT,
  INTO,
  IS,
  NOT,
  OR,
  ORDER,
  REMOVE,
  SELECT,
  SET,
  UPDATE,
  VALUE,
  WHERE
} from "./Keyword";
import { DoubleQuotedStringLiteral, SingleQuotedStringLiteral } from "./StringLiteral";
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
  SLASH
} from "./Symbol";

const lex = (source: string): readonly Token[] => new Lexer(source).lexAll();

describe("Lexer", () => {
  describe("Literal", () => {
    describe("boolean", () => {
      it("true", () => {
        const SOURCE = "true";
        const tokenList = lex(SOURCE);

        chai.expect(tokenList).deep.equals([TRUE]);
      });

      it("false", () => {
        const SOURCE = "false";
        const tokenList = lex(SOURCE);

        chai.expect(tokenList).deep.equals([FALSE]);
      });
    });

    it("integer", () => {
      const SOURCE = "123";
      const tokenList = lex(SOURCE);

      chai.expect(tokenList).deep.equals([new IntLiteral(123)]);
    });

    it("float", () => {
      const SOURCE = "123.0";
      const tokenList = lex(SOURCE);

      chai.expect(tokenList).deep.equals([new FloatLiteral(123)]);
    });

    describe("string", () => {
      it("single", () => {
        const SOURCE = `'Hello, World!'`;
        const tokenList = lex(SOURCE);

        chai.expect(tokenList).deep.equals([new SingleQuotedStringLiteral("Hello, World!")]);
      });

      it("double", () => {
        const SOURCE = `"Hello, World!"`;
        const tokenList = lex(SOURCE);

        chai.expect(tokenList).deep.equals([new DoubleQuotedStringLiteral("Hello, World!")]);
      });
    });
  });

  it("symbol", () => {
    const SOURCE_LIST = [
      ["[", LEFT_BRACKET],
      ["]", RIGHT_BRACKET],
      ["(", LEFT_PARENS],
      [")", RIGHT_PARENS],
      ["{", LEFT_BRACE],
      ["}", RIGHT_BRACE],
      ["<", LEFT_CHEVRON],
      ["<=", LEFT_CHEVRON_EQ],
      ["<<", LEFT_CHEVRON_LEFT_CHEVRON],
      ["<>", LEFT_CHEVRON_RIGHT_CHEVRON],
      [">", RIGHT_CHEVRON],
      [">=", RIGHT_CHEVRON_EQ],
      [">>", RIGHT_CHEVRON_RIGHT_CHEVRON],
      ["=", EQ],
      [":", COLON],
      [";", SEMICOLON],
      [",", COMMA],
      [".", DOT],
      ["+", PLUS],
      ["-", MINUS],
      ["*", ASTERISK],
      ["/", SLASH],
      ["%", PERCENT]
    ] as const;

    for (const [source, symbol] of SOURCE_LIST) {
      const tokenList = lex(source);

      chai.expect(tokenList).deep.equals([symbol]);
    }
  });

  it("keyword", () => {
    const SOURCE_LIST = [
      ["SELECT", SELECT],
      ["UPDATE", UPDATE],
      ["INSERT", INSERT],
      ["DELETE", DELETE],
      ["SET", SET],
      ["REMOVE", REMOVE],
      ["INTO", INTO],
      ["VALUE", VALUE],
      ["FROM", FROM],
      ["WHERE", WHERE],
      ["AND", AND],
      ["OR", OR],
      ["ORDER", ORDER],
      ["BY", BY],
      ["BETWEEN", BETWEEN],
      ["IN", IN],
      ["IS", IS],
      ["NOT", NOT],
      ["DESC", DESC],
      ["ASC", ASC],
      ["%", PERCENT]
    ] as const;

    for (const [source, keyword] of SOURCE_LIST) {
      const tokenList = lex(source);

      chai.expect(tokenList).deep.equals([keyword]);
    }
  });
});
