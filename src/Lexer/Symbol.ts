export class Symbol {
  constructor(readonly kind: SymbolKind) {}
}

export enum SymbolKind {
  LeftBracket = "[",
  RightBracket = "]",
  LeftParens = "(",
  RightParens = ")",
  LeftBrace = "{",
  RightBrace = "}",
  LeftChevron = "<",
  LeftChevronEq = "<=",
  LeftChevronLeftChevron = "<<",
  LeftChevronRightChevron = "<>",
  RightChevron = ">",
  RightChevronEq = ">=",
  RightChevronRightChevron = ">>",
  Eq = "=",
  Colon = ":",
  Semicolon = ";",
  Comma = ",",
  Dot = ".",
  Plus = "+",
  Minus = "-",
  Asterisk = "*",
  Slash = "/",
  Percent = "%"
}

export const LEFT_BRACKET = new Symbol(SymbolKind.LeftBracket);
export const RIGHT_BRACKET = new Symbol(SymbolKind.RightBracket);
export const LEFT_PARENS = new Symbol(SymbolKind.LeftParens);
export const RIGHT_PARENS = new Symbol(SymbolKind.RightParens);
export const LEFT_BRACE = new Symbol(SymbolKind.LeftBrace);
export const RIGHT_BRACE = new Symbol(SymbolKind.RightBrace);
export const LEFT_CHEVRON = new Symbol(SymbolKind.LeftChevron);
export const LEFT_CHEVRON_EQ = new Symbol(SymbolKind.LeftChevronEq);
export const LEFT_CHEVRON_LEFT_CHEVRON = new Symbol(SymbolKind.LeftChevronLeftChevron);
export const LEFT_CHEVRON_RIGHT_CHEVRON = new Symbol(SymbolKind.LeftChevronRightChevron);
export const RIGHT_CHEVRON = new Symbol(SymbolKind.RightChevron);
export const RIGHT_CHEVRON_EQ = new Symbol(SymbolKind.RightChevronEq);
export const RIGHT_CHEVRON_RIGHT_CHEVRON = new Symbol(SymbolKind.RightChevronRightChevron);
export const EQ = new Symbol(SymbolKind.Eq);
export const COLON = new Symbol(SymbolKind.Colon);
export const SEMICOLON = new Symbol(SymbolKind.Semicolon);
export const COMMA = new Symbol(SymbolKind.Comma);
export const DOT = new Symbol(SymbolKind.Dot);
export const PLUS = new Symbol(SymbolKind.Plus);
export const MINUS = new Symbol(SymbolKind.Minus);
export const ASTERISK = new Symbol(SymbolKind.Asterisk);
export const SLASH = new Symbol(SymbolKind.Slash);
export const PERCENT = new Symbol(SymbolKind.Percent);
