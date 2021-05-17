import { Attribute } from "./Attribute";
import { TableName } from "./TableName";
import { Condition } from "./Condition";
import { OrderBy } from "./OrderBy";

export class SelectStatement {
  constructor(
    readonly attributeList: readonly Attribute[],
    readonly tableName: TableName,
    readonly conditionList: null | readonly Condition[],
    readonly orderBy: readonly OrderBy[]
  ) {}
}
