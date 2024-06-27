import { DMLSchema, EntityIndex, QueryCondition } from "@medusajs/types"
import { isObject, isPresent } from "../../../common"
import { buildWhereQuery } from "./query-builder"

/*
  The DML provides an opinionated soft deletable entity as a part of every model
  We assume that deleted_at would be scoped in indexes in all cases as an index without the scope
  doesn't seem to be valid. If a case presents itself where one would like to remove the scope, 
  this will need to be updated to include that case.
*/
export function transformIndexWhere<TSchema extends DMLSchema>(
  index: EntityIndex<TSchema, string | QueryCondition>
): string {
  return isObject(index.where)
    ? transformWhereQb(index.where)
    : transformWhere(index.where)
}

function transformWhereQb(where: QueryCondition): string {
  if (!isPresent(where.deleted_at)) {
    where.deleted_at = null
  }

  return buildWhereQuery(where)
}

function transformWhere(where?: string): string {
  const lowerCaseWhere = where?.toLowerCase()
  const whereIncludesDeleteable =
    lowerCaseWhere?.includes("deleted_at is null") ||
    lowerCaseWhere?.includes("deleted_at is not null")

  // If where scope does not include a deleted_at scope, we add a soft deletable scope to it
  if (where && !whereIncludesDeleteable) {
    where = where + ` AND deleted_at IS NULL`
  }

  // If where scope isn't present, we will set an opinionated where scope to the index
  if (!where?.length) {
    where = "deleted_at IS NULL"
  }

  return where
}

/*
  When a "belongsTo" relationship is found on the DML schema, we create a default index on the
  foreign key name of the field.
*/
export function buildForeignKeyIndexes<TSchema extends DMLSchema>(
  schema: TSchema
) {
  const indexes: EntityIndex<TSchema, QueryCondition>[] = []

  for (const [field, property] of Object.entries(schema)) {
    const parsed = property.parse(field)
    const isRelationshipType = "type" in parsed
    const isBelongsTo = isRelationshipType && parsed.type === "belongsTo"

    if (!isBelongsTo) {
      continue
    }

    // TODO: infer the keyname from schema
    const foreignKeyName: any = `${field}_id`

    indexes.push({
      on: [foreignKeyName],
      where: { deleted_at: null },
    })
  }

  return indexes
}
