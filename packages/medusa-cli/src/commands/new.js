/*
 * Adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.ts
 */

import { execSync } from "child_process"
import execa from "execa"
import { sync as existsSync } from "fs-exists-cached"
import fs from "fs-extra"
import hostedGitInfo from "hosted-git-info"
import isValid from "is-valid-path"
import sysPath from "path"
import prompts from "prompts"
import url from "url"
import { createDatabase } from "pg-god"

import reporter from "../reporter"
import { getPackageManager, setPackageManager } from "../util/package-manager"

const spawnWithArgs = (file, args, options) =>
  execa(file, args, { stdio: `inherit`, preferLocal: false, ...options })

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/)
  return spawnWithArgs(file, args, options)
}
// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
const checkForYarn = () => {
  try {
    execSync(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (e) {
    return false
  }
}

const isAlreadyGitRepository = async () => {
  try {
    return await spawn(`git rev-parse --is-inside-work-tree`, {
      stdio: `pipe`,
    }).then(output => output.stdout === `true`)
  } catch (err) {
    return false
  }
}

// Initialize newly cloned directory as a git repo
const gitInit = async rootPath => {
  reporter.info(`Initialising git in ${rootPath}`)

  return await spawn(`git init`, { cwd: rootPath })
}

// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async rootPath => {
  if (existsSync(sysPath.join(rootPath, `.gitignore`))) {
    return
  }

  const gignore = reporter.activity(
    `Creating minimal .gitignore in ${rootPath}`
  )
  await fs.writeFile(
    sysPath.join(rootPath, `.gitignore`),
    `.cache\nnode_modules\npublic\n`
  )
  reporter.success(gignore, `Created .gitignore in ${rootPath}`)
}

// Create an initial git commit in the new directory
const createInitialGitCommit = async (rootPath, starterUrl) => {
  reporter.info(`Create initial git commit in ${rootPath}`)

  await spawn(`git add -A`, { cwd: rootPath })
  // use execSync instead of spawn to handle git clients using
  // pgp signatures (with password)
  try {
    execSync(`git commit -m "Initial commit from gatsby: (${starterUrl})"`, {
      cwd: rootPath,
    })
  } catch {
    // Remove git support if initial commit fails
    reporter.warn(`Initial git commit failed - removing git support\n`)
    fs.removeSync(sysPath.join(rootPath, `.git`))
  }
}

// Executes `npm install` or `yarn install` in rootPath.
const install = async rootPath => {
  const prevDir = process.cwd()

  reporter.info(`Installing packages...`)
  process.chdir(rootPath)

  const npmConfigUserAgent = process.env.npm_config_user_agent

  try {
    if (!getPackageManager()) {
      if (npmConfigUserAgent?.includes(`yarn`)) {
        setPackageManager(`yarn`)
      } else {
        setPackageManager(`npm`)
      }
    }
    if (getPackageManager() === `yarn` && checkForYarn()) {
      await fs.remove(`package-lock.json`)
      await spawn(`yarnpkg`)
    } else {
      await fs.remove(`yarn.lock`)
      await spawn(`npm install`)
    }
  } finally {
    process.chdir(prevDir)
  }
}

const ignored = path => !/^\.(git|hg)$/.test(sysPath.basename(path))

// Copy starter from file system.
const copy = async (starterPath, rootPath) => {
  // Chmod with 755.
  // 493 = parseInt('755', 8)
  await fs.ensureDir(rootPath, { mode: 493 })

  if (!existsSync(starterPath)) {
    throw new Error(`starter ${starterPath} doesn't exist`)
  }

  if (starterPath === `.`) {
    throw new Error(
      `You can't create a starter from the existing directory. If you want to
      create a new project in the current directory, the trailing dot isn't
      necessary. If you want to create a project from a local starter, run
      something like "medusa new my-medusa-store ../local-medusa-starter"`
    )
  }

  reporter.info(`Creating new site from local starter: ${starterPath}`)

  const copyActivity = reporter.activity(
    `Copying local starter to ${rootPath} ...`
  )

  await fs.copy(starterPath, rootPath, { filter: ignored })

  reporter.success(copyActivity, `Created starter directory layout`)

  await install(rootPath)

  return true
}

// Clones starter from URI.
const clone = async (hostInfo, rootPath) => {
  let url
  // Let people use private repos accessed over SSH.
  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({ noCommittish: true })
    // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({ noCommittish: true, noGitPlus: true })
  }

  const branch = hostInfo.committish ? [`-b`, hostInfo.committish] : []

  const createAct = reporter.activity(`Creating new site from git: ${url}`)

  const args = [
    `clone`,
    ...branch,
    url,
    rootPath,
    `--recursive`,
    `--depth=1`,
  ].filter(arg => Boolean(arg))

  await spawnWithArgs(`git`, args)

  reporter.success(createAct, `Created starter directory layout`)

  await fs.remove(sysPath.join(rootPath, `.git`))

  await install(rootPath)
  const isGit = await isAlreadyGitRepository()
  if (!isGit) await gitInit(rootPath)
  await maybeCreateGitIgnore(rootPath)
  if (!isGit) await createInitialGitCommit(rootPath, url)
}

const getPaths = async (starterPath, rootPath) => {
  let selectedOtherStarter = false

  // if no args are passed, prompt user for path and starter
  if (!starterPath && !rootPath) {
    const response = await prompts.prompt([
      {
        type: `text`,
        name: `path`,
        message: `What is your project called?`,
        initial: `my-medusa-store`,
      },
    ])
    // exit gracefully if responses aren't provided
    if (!response.starter || !response.path.trim()) {
      throw new Error(
        `Please mention both starter package and project name along with path(if its not in the root)`
      )
    }

    selectedOtherStarter = response.starter === `different`
    starterPath = `medusajs/medusa-starter-default`
    rootPath = response.path
  }

  // set defaults if no root or starter has been set yet
  rootPath = rootPath || process.cwd()
  starterPath = starterPath || `medusajs/medusa-starter-default`

  return { starterPath, rootPath, selectedOtherStarter }
}

const successMessage = path => {
  reporter.info(`
Your new Medusa project is ready for you! To start developing run:

  cd ${path}
  medusa develop
`)
}

const defaultDBCreds = {
  user: "postgres",
  database: "postgres",
  password: "",
  port: 5432,
  host: "localhost",
}

const setupDB = async (dbName, dbCreds = {}) => {
  const credentials = Object.assign(defaultDBCreds, dbCreds)

  const dbActivity = reporter.activity(`Setting up database "${dbName}"...`)
  await createDatabase(
    {
      databaseName: dbName,
      errorIfExist: true,
    },
    credentials
  )
    .then(() => {
      reporter.success(dbActivity, `Created database "${dbName}"`)
    })
    .catch(err => {
      if ((err.name = "PDG_ERR::DuplicateDatabase")) {
        reporter.success(
          dbActivity,
          `Database ${dbName} already exists; skipping setup`
        )
      } else {
        reporter.failure(dbActivity, `Skipping database setup.`)
        reporter.warn(
          `Failed to setup database; install PostgresQL or make sure to manage your database connection manually`
        )
        console.error(err)
      }
    })
}

const setupEnvVars = async (rootPath, dbName, dbCreds = {}) => {
  const credentials = Object.assign(defaultDBCreds, dbCreds)

  const templatePath = sysPath.join(rootPath, ".env.template")
  const destination = sysPath.join(rootPath, ".env")
  if (existsSync(templatePath)) {
    fs.renameSync(templatePath, destination)
    fs.appendFileSync(
      destination,
      `DATABASE_URL=postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${dbName}\n`
    )
  } else {
    reporter.info(`No .env.template found. Creating .env.`)
    fs.appendFileSync(
      destination,
      `DATABASE_URL=postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${dbName}\n`
    )
  }
}

/**
 * Main function that clones or copies the starter.
 */
export const newStarter = async (starter, root) => {
  const { starterPath, rootPath } = await getPaths(starter, root)

  const urlObject = url.parse(rootPath)

  if (urlObject.protocol && urlObject.host) {
    const isStarterAUrl =
      starter && !url.parse(starter).hostname && !url.parse(starter).protocol

    if (/medusa-starter/gi.test(rootPath) && isStarterAUrl) {
      reporter.panic({
        id: `11610`,
        context: {
          starter,
          rootPath,
        },
      })
      return
    }
    reporter.panic({
      id: `11611`,
      context: {
        rootPath,
      },
    })
    return
  }

  if (!isValid(rootPath)) {
    reporter.panic({
      id: `11612`,
      context: {
        path: sysPath.resolve(rootPath),
      },
    })
    return
  }

  if (existsSync(sysPath.join(rootPath, `package.json`))) {
    reporter.panic({
      id: `11613`,
      context: {
        rootPath,
      },
    })
    return
  }

  const hostedInfo = hostedGitInfo.fromUrl(starterPath)
  if (hostedInfo) {
    await clone(hostedInfo, rootPath)
  } else {
    await copy(starterPath, rootPath)
  }

  await setupDB(root)
  await setupEnvVars(rootPath, root)

  // const sitePath = sysPath.resolve(rootPath)

  // const sitePackageJson = await fs
  //   .readJSON(sysPath.join(sitePath, `package.json`))
  //   .catch(() => {
  //     reporter.verbose(
  //       `Could not read "${sysPath.join(sitePath, `package.json`)}"`
  //     )
  //   })

  successMessage(rootPath)
}
