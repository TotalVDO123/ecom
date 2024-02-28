import { initDb, useDb } from "../../../environment-helpers/use-db"

import { AxiosInstance } from "axios"
import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAdminUser } from "../../helpers/create-admin-user"
import { getContainer } from "../../../environment-helpers/use-container"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../environment-helpers/use-api"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("GET /admin/users", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let userModuleService: IUserModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
  })

  beforeEach(async () => {
    await createAdminUser(dbConnection, adminHeaders)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should list users", async () => {
    await userModuleService.create([
      {
        email: "member@test.com",
      },
    ])

    const api = useApi()! as AxiosInstance

    const response = await api.get(`/admin/users`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          email: "admin@medusa.js",
        }),
        expect.objectContaining({ email: "member@test.com" }),
      ]),
      count: 2,
      offset: 0,
      limit: 50,
    })
  })
})
