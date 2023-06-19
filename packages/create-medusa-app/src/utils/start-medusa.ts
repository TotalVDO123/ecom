import { exec } from "child_process"

type StartOptions = {
  directory: string
  abortController?: AbortController
}

export default ({ directory, abortController }: StartOptions) => {
  const childProcess = exec(`npx -y @medusajs/medusa-cli@latest develop`, {
    cwd: directory,
    signal: abortController?.signal,
    env: {
      ...process.env,
      OPEN_BROWSER: "false",
    },
  })

  childProcess.stdout?.pipe(process.stdout)
}
