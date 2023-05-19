const globalTypedocOptions = require("./typedoc")

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  ...globalTypedocOptions,
  entryPoints: ["packages/medusa/src/services/batch-job.ts"],
  out: ["docs/testing"],
  tsconfig: "packages/medusa/tsconfig.json",
  plugin: [
    ...globalTypedocOptions.plugin,
    "typedoc-reference-type-plugin"
  ],
  referenceType: [
    "event"
  ],
  inlineTags: [
    `@referenceType`
  ],
  blockTags: [
    `@myEventProperty`
  ]
}