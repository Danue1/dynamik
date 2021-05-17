import { Condition } from "./Condition";
import { TableName } from "./TableName";
import { UpdateValueStatement } from "./UpdateValueStatement";

export class UpdateStatement {
  constructor(
    readonly tableName: TableName,
    readonly statementList: readonly UpdateValueStatement[],
    readonly conditionList: readonly Condition[]
  ) {}
}
