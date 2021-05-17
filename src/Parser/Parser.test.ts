import chai from "chai";
import { Lexer } from "../Lexer";
import { NamedAttribute, QuotedAttribute, WILDCARD } from "./Attribute";
import { ComparisonOperator, Condition } from "./Condition";
import { DeleteStatement } from "./DeleteStatement";
import { Parser } from "./index";
import { InsertStatement } from "./InsertStatement";
import { SelectStatement } from "./SelectStatement";
import { TableName } from "./TableName";
import { UpdateStatement } from "./UpdateStatement";
import { SetStatement } from "./UpdateValueStatement";
import { ValueBooleanLiteral, ValueIntLiteral, ValueObjectLiteral, ValueStringLiteral } from "./ValueLiteral";

const parse = (source: string) => new Parser(new Lexer(source).lexAll()).parseAll();

describe("Parser", () => {
  describe("SELECT Statement", () => {
    it(`SELECT * FROM User`, () => {
      const SOURCE = `SELECT * FROM User`;
      const statementList = parse(SOURCE);

      chai.expect(statementList).deep.equals([new SelectStatement([WILDCARD], new TableName("User"), null, [])]);
    });

    it(`SELECT * FROM User WHERE id = true`, () => {
      const SOURCE = `SELECT * FROM User WHERE id = true`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([
          new SelectStatement(
            [WILDCARD],
            new TableName("User"),
            [new Condition(new NamedAttribute("id"), ComparisonOperator.Eq, new ValueBooleanLiteral(true))],
            []
          )
        ]);
    });

    it(`SELECT * FROM User WHERE id = '1'`, () => {
      const SOURCE = `SELECT * FROM User WHERE id = '1'`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([
          new SelectStatement(
            [WILDCARD],
            new TableName("User"),
            [new Condition(new NamedAttribute("id"), ComparisonOperator.Eq, new ValueStringLiteral("1"))],
            []
          )
        ]);
    });

    it(`SELECT * FROM User WHERE id = '1'`, () => {
      const SOURCE = `SELECT * FROM User WHERE id = '1'`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([
          new SelectStatement(
            [WILDCARD],
            new TableName("User"),
            [new Condition(new NamedAttribute("id"), ComparisonOperator.Eq, new ValueStringLiteral("1"))],
            []
          )
        ]);
    });

    it(`SELECT * FROM User WHERE "id" = '1'`, () => {
      const SOURCE = `SELECT * FROM User WHERE "id" = '1'`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([
          new SelectStatement(
            [WILDCARD],
            new TableName("User"),
            [new Condition(new QuotedAttribute("id"), ComparisonOperator.Eq, new ValueStringLiteral("1"))],
            []
          )
        ]);
    });
  });

  describe("INSERT Statement", () => {
    it(`INSERT INTO User VALUE { 'id': '1' }`, () => {
      const SOURCE = `INSERT INTO User VALUE { 'id': '1' }`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([new InsertStatement(new TableName("User"), new ValueObjectLiteral({ id: new ValueStringLiteral("1") }))]);
    });
  });

  describe("UPDATE Statement", () => {
    it(`UPDATE User SET id = 1 WHERE id = 1`, () => {
      const SOURCE = `UPDATE User SET id = 1 WHERE id = 1`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([
          new UpdateStatement(
            new TableName("User"),
            [new SetStatement(new NamedAttribute("id"), new ValueIntLiteral(1))],
            [new Condition(new NamedAttribute("id"), ComparisonOperator.Eq, new ValueIntLiteral(1))]
          )
        ]);
    });
  });

  describe("DELETE Statement", () => {
    it(`DELETE User WHERE id = 1`, () => {
      const SOURCE = `DELETE User WHERE id = 1`;
      const statementList = parse(SOURCE);

      chai
        .expect(statementList)
        .deep.equals([
          new DeleteStatement(new TableName("User"), [
            new Condition(new NamedAttribute("id"), ComparisonOperator.Eq, new ValueIntLiteral(1))
          ])
        ]);
    });
  });
});
