import * as core from '@actions/core'
import * as jsyaml from 'js-yaml'
import * as fs from 'fs'
import * as jmespath from '@metrichor/jmespath'

import * as config from './config'
import * as miners from './miners'
import * as ignore from './ignore'

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
            throw new Error(
                'Invalid configuration file: should contain a dictionary'
            )
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

    if (!result.config && !result.script) {
        throw new Error('one of config or script should be specified')
    }

    if (result.script) {
        if (!result.scriptResult)
            throw new Error('scriptResult is required when using script')
        if (result.config) {
            core.warning('script argument specified, config ignored')
            delete result.config
        }

        return result
    }

    if (!result.configSection) {
        throw new Error('configSection is required when using config')
    }
    if (!result.config!.has(result.configSection)) {
        throw new Error(
            `Section ${result.configSection} does not exist in config`
        )
    }

    return result
}

function writeResult(path: string, result: jmespath.JSONValue) {
    fs.writeFileSync(path, JSON.stringify(result, null, 4), {
        encoding: 'utf-8'
    })
}

async function run(): Promise<void> {
    try {
        const inputs = parseInputs()

        if (inputs.config) {
            const csection = inputs.config.get(inputs.configSection!)!

            for (const miningConfig of csection) {
                core.info(`Handling mining config ${miningConfig.name}...`)

                const minerDefinition = miners.registry[miningConfig.miner]
                if (!minerDefinition)
                    throw new Error(`Unknown miner ${miningConfig.miner}`)

                let result = await minerDefinition.miner(miningConfig.args)

                for (const o of miningConfig.outputs) {
                    let survivingResults = await ignore.applyIgnore(
                        o.resultPath,
                        minerDefinition.endpointAttribute,
                        result
                    )

                    writeResult(
                        o.resultPath,
                        jmespath.search(
                            survivingResults,
                            o.filter || minerDefinition.defaultFilter
                        )
                    )
                }
            }

            return
        }

        // script
        throw new Error(`Support for script not implemented yet`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
