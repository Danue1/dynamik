import { TableName } from "./TableName";
import { ValueObjectLiteral } from "./ValueLiteral";

export class InsertStatement {
  constructor(readonly tableName: TableName, readonly values: ValueObjectLiteral) {}
}
