import { IsNumber, IsOptional, IsString } from "class-validator"
import NoteService from "../../../../services/note"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /notes
 * operationId: "GetNotes"
 * summary: "List Notes"
 * x-authenticated: true
 * description: "Retrieves a list of notes"
 *  * parameters:
 *   - (path) limit= {number} The number of notes to get
 *   - (path) offset= {number} The offset at which to get notes
 *   - (path) resource_id= {string} The id which the notes belongs to
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             notes:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/note"
 */
export default async (req, res) => {
  const validated = await validator(AdminGetNotesReq, req.query)

  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector: selector = {}

  if (validated.resource_id) {
    selector.resource_id = validated.resource_id
  }

  const noteService = req.scope.resolve("noteService") as NoteService
  const notes = await noteService.list(selector, {
    take: limit,
    skip: offset,
    relations: ["author"],
  })

  res.status(200).json({ notes, count: notes.length, offset, limit })
}
type selector = {
  resource_id?: string
}

export class AdminGetNotesReq {
  @IsString()
  @IsOptional()
  resource_id: string

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number
}
