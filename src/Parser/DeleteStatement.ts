import { Condition } from "./Condition";
import { TableName } from "./TableName";

export class DeleteStatement {
  constructor(readonly tableName: TableName, readonly conditionList: readonly Condition[]) {}
}
