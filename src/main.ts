import * as core from '@actions/core'
import * as jsyaml from 'js-yaml'
import * as fs from 'fs'

import * as config from './config'

interface ActionInputs {
  script?: string
  scriptResult?: string
  config?: config.Config
  configSection?: string
}

function parseInputs(): ActionInputs {
  const result: ActionInputs = {}

  const configPath = core.getInput('config')
  if (configPath) {
    const readConfig = jsyaml.load(
      fs.readFileSync(configPath, {encoding: 'utf-8'}),
      {schema: jsyaml.JSON_SCHEMA}
    )
    if (typeof readConfig !== 'object' || !readConfig)
      throw new Error('Invalid configuration file: should contain a dictionary')
    result.config = config.fromObject(readConfig)
  }

  const configSection = core.getInput('configSection')
  if (configSection) {
    result.configSection = configSection
  }

  const script = core.getInput('script')
  if (script) {
    result.script = script
  }

  const scriptResult = core.getInput('scriptResult')
  if (scriptResult) {
    result.scriptResult = scriptResult
  }

  if (!result.config || !result.script) {
    throw new Error('config or script should be specified')
  }

  if (result.script && !result.scriptResult) {
    if (!result.scriptResult)
      throw new Error('scriptResult is required when using script')
    if (result.config) core.warning('script argument specified, config ignored')

    return result
  }

  if (!result.configSection) {
    throw new Error('configSection is required when using config')
  }
  if (!result.config.has(result.configSection)) {
    throw new Error(`Section ${result.configSection} does not exist in config`)
  }

  return result
}

async function run(): Promise<void> {
  try {
    const inputs = parseInputs()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
