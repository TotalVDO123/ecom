import { IsString } from "class-validator"

/**
 * [delete] /uploads
 * operationId: "AdminDeleteUpload"
 * summary: "Removes an uploaded file"
 * description: "Removes an uploaded file using the installed fileservice"
 * x-authenticated: true
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  const validated = req.validatedBody as AdminDeleteUploadReq

  const fileService = req.scope.resolve("fileService")

  await fileService.delete(validated)

  res
    .status(200)
    .send({ id: validated.file_key, object: "file", deleted: true })
}

export class AdminDeleteUploadsReq {
  @IsString()
  file_key: string
}
