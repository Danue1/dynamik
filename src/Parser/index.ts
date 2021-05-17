import { Token } from "../Lexer";
import { FALSE, TRUE } from "../Lexer/BooleanLiteral";
import { FloatLiteral } from "../Lexer/FloatLiteral";
import { Identifier } from "../Lexer/Identifier";
import { IntLiteral } from "../Lexer/IntLiteral";
import {
  AND,
  ASC,
  BY,
  DELETE,
  DESC,
  FROM,
  INSERT,
  INTO,
  Keyword,
  ORDER,
  REMOVE,
  SELECT,
  SET,
  UPDATE,
  VALUE,
  WHERE
} from "../Lexer/Keyword";
import { NULL } from "../Lexer/NullLiteral";
import { DoubleQuotedStringLiteral, SingleQuotedStringLiteral } from "../Lexer/StringLiteral";
import {
  ASTERISK,
  COLON,
  COMMA,
  EQ,
  LEFT_BRACE,
  LEFT_BRACKET,
  LEFT_CHEVRON,
  LEFT_CHEVRON_EQ,
  LEFT_CHEVRON_RIGHT_CHEVRON,
  RIGHT_BRACE,
  RIGHT_BRACKET,
  RIGHT_CHEVRON,
  RIGHT_CHEVRON_EQ,
  SEMICOLON,
  Symbol
} from "../Lexer/Symbol";
import { Attribute, NamedAttribute, QuotedAttribute, WILDCARD, WildcardAttribute } from "./Attribute";
import { ComparisonOperator, Condition } from "./Condition";
import { DeleteStatement } from "./DeleteStatement";
import { InsertStatement } from "./InsertStatement";
import { Direction, OrderBy } from "./OrderBy";
import { SelectStatement } from "./SelectStatement";
import { TableName } from "./TableName";
import { UpdateStatement } from "./UpdateStatement";
import { RemoveStatement, SetStatement, UpdateValueStatement } from "./UpdateValueStatement";
import {
  ValueBooleanLiteral,
  ValueFloatLiteral,
  ValueIntLiteral,
  ValueLiteral,
  ValueNullLiteral,
  ValueObjectLiteral,
  ValueStringLiteral
} from "./ValueLiteral";

export * from "./Attribute";
export * from "./Condition";
export * from "./DeleteStatement";
export * from "./InsertStatement";
export * from "./OrderBy";
export * from "./SelectStatement";
export * from "./TableName";
export * from "./UpdateStatement";
export * from "./UpdateValueStatement";

export class Parser {
  private position = 0;

  constructor(private readonly tokenList: readonly Token[]) {}

  parseAll(): readonly Statement[] {
    this.position = 0;

    const statementList = [];
    while (true) {
      this.skipIgnorable();
      if (this.hasNext()) {
        statementList.push(this.parse());
      } else {
        break;
      }
    }
    return statementList;
  }

  private hasNext(): boolean {
    return this.position !== this.tokenList.length;
  }

  private skipIgnorable(): void {
    while (true) {
      const token = this.current();
      if (token === SEMICOLON) {
        this.consume();
      } else {
        break;
      }
    }
  }

  private parse(): Statement {
    switch (this.current()) {
      case SELECT: {
        return this.parseSelectStatement();
      }
      case INSERT: {
        return this.parseInsertStatement();
      }
      case UPDATE: {
        return this.parseUpdateStatement();
      }
      case DELETE: {
        return this.parseDeleteStatement();
      }
    }
    return throws("지원하지 않는 Statement입니다.");
  }

  private parseSelectStatement(): SelectStatement {
    this.consumeKeyword(SELECT);
    const attributeList = this.parseAttributeList();
    const tableName = this.parseFromTableName();
    const conditions = this.parseWhereConditions();
    const orderByList = this.parseOrderByList();
    return new SelectStatement(attributeList, tableName, conditions, orderByList);
  }

  private parseInsertStatement(): InsertStatement {
    this.consumeKeyword(INSERT);
    this.consumeKeyword(INTO);
    const tableName = this.parseTableName();
    this.consumeKeyword(VALUE);
    const values = this.parseValueObjectLiteral() ?? throws("저장할 값이 없습니다.");
    return new InsertStatement(tableName, values);
  }

  private parseUpdateStatement(): UpdateStatement {
    this.consumeKeyword(UPDATE);
    const tableName = this.parseTableName();
    const statementList = this.parseUpdateValueStatementList();
    const conditions = this.parseWhereConditions();
    if (!conditions) {
      return throws("UPDATE Statement는 WHERE 구문이 있어야 합니다.");
    }
    return new UpdateStatement(tableName, statementList, conditions);
  }

  private parseDeleteStatement(): DeleteStatement {
    this.consumeKeyword(DELETE);
    const tableName = this.parseTableName();
    const conditions = this.parseWhereConditions();
    if (!conditions) {
      return throws("DELETE Statement는 WHERE 구문이 있어야 합니다.");
    }
    return new DeleteStatement(tableName, conditions);
  }

  private parseAttributeList(): readonly Attribute[] {
    const attributeList = [this.parseAttribute()];
    while (this.current() === COMMA) {
      this.consume();
      attributeList.push(this.parseAttribute());
    }
    return attributeList;
  }

  private parseAttribute(): Attribute {
    return (
      this.parseWildcardAttribute() ??
      this.parseNamedAttribute() ??
      this.parseQuotedAttribute() ??
      throws("Projection 할 Attribute가 적절하지 않습니다.")
    );
  }

  private parseWildcardAttribute(): null | WildcardAttribute {
    const token = this.current();
    if (token === ASTERISK) {
      this.consume();
      return WILDCARD;
    }
    return null;
  }

  private parseNamedAttribute(): null | NamedAttribute {
    const token = this.current();
    if (token instanceof Identifier) {
      this.consume();
      return new NamedAttribute(token.value);
    }
    return null;
  }

  private parseQuotedAttribute(): null | QuotedAttribute {
    const token = this.current();
    if (token instanceof DoubleQuotedStringLiteral) {
      this.consume();
      return new QuotedAttribute(token.value);
    }
    return null;
  }

  private parseFromTableName(): TableName {
    this.consumeKeyword(FROM);
    return this.parseTableName();
  }

  private parseTableName(): TableName {
    const tableName = this.consumeIdentifier().value;
    return new TableName(tableName);
  }

  private parseWhereConditions(): null | readonly Condition[] {
    if (this.current() !== WHERE) {
      return null;
    }
    this.consume();
    return this.parseConditions();
  }

  private parseConditions(): readonly Condition[] {
    const conditionList = [this.parseCondition()];
    while (this.current() === AND) {
      this.consume();
      conditionList.push(this.parseCondition());
    }
    return conditionList;
  }

  private parseCondition(): Condition {
    const key = this.parseNamedAttribute() ?? this.parseQuotedAttribute() ?? throws("적절한 Attribute 구문이 아닙니다.");
    const operator = this.parseOperator();
    const value = this.parseValueLiteral();
    return new Condition(key, operator, value);
  }

  private parseOperator(): ComparisonOperator {
    switch (this.current()) {
      case EQ: {
        this.consume();
        return ComparisonOperator.Eq;
      }
      case LEFT_CHEVRON: {
        this.consume();
        return ComparisonOperator.LessThan;
      }
      case LEFT_CHEVRON_EQ: {
        this.consume();
        return ComparisonOperator.LessThanOrEq;
      }
      case LEFT_CHEVRON_RIGHT_CHEVRON: {
        this.consume();
        return ComparisonOperator.NotEq;
      }
      case RIGHT_CHEVRON: {
        this.consume();
        return ComparisonOperator.GreaterThan;
      }
      case RIGHT_CHEVRON_EQ: {
        this.consume();
        return ComparisonOperator.GreaterThanOrEq;
      }
    }
    return throws("지원하지 않는 연산자입니다.");
  }

  private parseOrderByList(): readonly OrderBy[] {
    if (this.current() !== ORDER) {
      return [];
    }

    this.consumeKeyword(BY);

    const orderByList = [];
    while (true) {
      const attribute = this.parseNamedAttribute() ?? this.parseQuotedAttribute() ?? throws("적절한 Attribute 구문이 아닙니다.");
      switch (this.current()) {
        case ASC: {
          this.consume();
          orderByList.push(new OrderBy(attribute, Direction.Asc));
          continue;
        }
        case DESC: {
          this.consume();
          orderByList.push(new OrderBy(attribute, Direction.Desc));
          continue;
        }
      }
      break;
    }
    return orderByList;
  }

  private parseValueNullLiteral(): null | ValueNullLiteral {
    if (this.current() === NULL) {
      this.consume();
      return new ValueNullLiteral();
    }
    return null;
  }

  private parseValueBooleanLiteral(): null | ValueBooleanLiteral {
    switch (this.current()) {
      case TRUE: {
        this.consume();
        return new ValueBooleanLiteral(true);
      }
      case FALSE: {
        this.consume();
        return new ValueBooleanLiteral(false);
      }
    }
    return null;
  }

  private parseValueIntLiteral(): null | ValueIntLiteral {
    const token = this.current();
    if (token instanceof IntLiteral) {
      this.consume();
      return new ValueIntLiteral(token.value);
    }
    return null;
  }

  private parseValueFloatLiteral(): null | ValueFloatLiteral {
    const token = this.current();
    if (token instanceof FloatLiteral) {
      this.consume();
      return new ValueFloatLiteral(token.value);
    }
    return null;
  }

  private parseValueStringLiteral(): null | ValueStringLiteral {
    const token = this.current();
    if (token instanceof SingleQuotedStringLiteral) {
      this.consume();
      return new ValueStringLiteral(token.value);
    }
    return null;
  }

  private parseValueLiteral(): ValueLiteral {
    return (
      this.parseValueNullLiteral() ??
      this.parseValueBooleanLiteral() ??
      this.parseValueIntLiteral() ??
      this.parseValueFloatLiteral() ??
      this.parseValueStringLiteral() ??
      this.parseValueObjectLiteral() ??
      this.parseValueListLiteral() ??
      throws("적절한 Value Literal 문법이 아닙니다.")
    );
  }

  private parseValueObjectLiteral(): null | ValueObjectLiteral {
    if (this.current() !== LEFT_BRACE) {
      return null;
    }

    this.consume();
    const object: Record<string, ValueLiteral> = {};
    while (true) {
      const token = this.current();
      if (token instanceof SingleQuotedStringLiteral) {
        this.consume();
        this.consumeSymbol(COLON);
        object[token.value] = this.parseValueLiteral();
        if (this.current() !== COMMA) {
          break;
        }
      } else {
        break;
      }
    }
    this.consumeSymbol(RIGHT_BRACE);
    return new ValueObjectLiteral(object);
  }

  private parseValueListLiteral(): null | readonly ValueLiteral[] {
    if (this.current() !== LEFT_BRACKET) {
      return null;
    }

    this.consume();

    const list = [];
    while (this.current() === RIGHT_BRACKET) {
      list.push(this.parseValueLiteral());
    }
    this.consumeSymbol(RIGHT_BRACKET);
    return list;
  }

  private parseUpdateValueStatementList(): readonly UpdateValueStatement[] {
    const statementList = [];
    while (true) {
      switch (this.current()) {
        case SET: {
          statementList.push(this.parseSetStatement());
          continue;
        }
        case REMOVE: {
          statementList.push(this.parseRemoveStatement());
          continue;
        }
      }
      break;
    }
    return statementList;
  }

  private parseSetStatement(): SetStatement {
    this.consumeKeyword(SET);
    const attribute = this.parseNamedAttribute() ?? this.parseQuotedAttribute() ?? throws("적절한 Attribute 문법이 아닙니다.");
    this.consumeSymbol(EQ);
    const value = this.parseValueLiteral() ?? throws("");
    return new SetStatement(attribute, value);
  }

  private parseRemoveStatement(): RemoveStatement {
    this.consumeKeyword(REMOVE);
    const attribute = this.parseNamedAttribute() ?? this.parseQuotedAttribute() ?? throws("적절한 Attribute 문법이 아닙니다.");
    return new RemoveStatement(attribute);
  }

  private consumeIdentifier(): Identifier {
    const token = this.current();
    if (token instanceof Identifier) {
      this.consume();
      return token;
    }
    return throws("적절한 Identifier 구문이 아닙니다.");
  }

  private consumeKeyword(keyword: Keyword): void {
    if (this.current() !== keyword) {
      return throws("적절한 Keyword 구문이 아닙니다.");
    }
    this.consume();
  }

  private consumeSymbol(symbol: Symbol): void {
    if (this.current() !== symbol) {
      return throws("적절한 Symbol 구문이 아닙니다.");
    }
    this.consume();
  }

  private consume(): void {
    this.position += 1;
  }

  private current(): null | Token {
    return this.tokenList[this.position] ?? null;
  }
}

export type Statement = SelectStatement | InsertStatement | UpdateStatement | DeleteStatement;

const throws = (message: string): never => {
  throw new Error(message);
};
