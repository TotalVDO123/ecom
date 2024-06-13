import { BaseRelationship } from "./base"
import { NullableModifier } from "../modifiers/nullable"
import { RelationshipMetadata } from "../types"

/**
 * HasOne relationship defines a relationship between two entities
 * where the owner of the relationship has exactly one instance
 * of the related entity.
 *
 * For example: A user HasOne profile
 *
 * You may use the "BelongsTo" relationship to define the inverse
 * of the "HasOne" relationship
 */
export class HasOne<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "hasOne"

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T, HasOne<T>>(this)
  }
}
