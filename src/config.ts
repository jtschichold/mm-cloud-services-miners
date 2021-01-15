/* eslint-disable @typescript-eslint/no-explicit-any */

import * as core from '@actions/core'
import * as jmespath from 'jmespath'

interface MiningConfigOutput {
    resultPath: string
    filter?: string
}

export interface MiningConfig {
    name: string
    miner: string
    args: Map<string, string | number | boolean | null>
    outputs: MiningConfigOutput[]
}

export type Config = Map<string, MiningConfig[]>

function miningConfigOutputsFromObject(
    o: any,
    title: string,
    name: string
): MiningConfigOutput[] {
    const result: MiningConfigOutput[] = []

    if (!(o instanceof Array)) {
        core.error(
            `Outputs should be a list, in mining config ${name} of section ${title}.`
        )
        return []
    }
    if (o.length === 0) {
        core.error(
            `Outputs should be a non empty list, in mining config ${name} of section ${title}.`
        )
        return []
    }

    for (const cmco of o) {
        const {filter: jmespathFilter, resultPath} = cmco

        if (!resultPath) {
            core.error(
                `Missing resultPath in output of mining config ${name} of section ${title}. Output ignored.`
            )
            continue
        }
        if (typeof resultPath !== 'string') {
            core.error(
                `Invalid resultPath in output of mining config ${name} of section ${title}. resultPath should be a string. Output ignored.`
            )
            continue
        }

        const mco: MiningConfigOutput = {
            resultPath
        }
        if (jmespathFilter) {
            if (typeof jmespathFilter !== 'string') {
                core.error(
                    `Invalid filter in output of mining config ${name} of section ${title}. filter should be a string. Output ignored.`
                )
                continue
            }
            try {
                jmespath.search({}, jmespathFilter)
            } catch (error) {
                core.error(
                    `Invalid filter in output of mining config ${name} of section ${title}. filter is not a valid JMESPath expression. Output ignored.`
                )
                continue
            }
            mco.filter = jmespathFilter
        }
        result.push(mco)
    }

    return result
}

function miningConfigFromObject(
    o: any,
    title: string
): MiningConfig | undefined {
    let {name, miner, args, outputs} = o

    if (name && typeof name !== 'string') {
        core.error(
            `Invalid name for mining config of section ${title}, name is not a string. Mining config ignored.`
        )
        return
    }
    if (!name) {
        core.warning(
            `A mining config of section ${title} is missing name attribute.`
        )
    }
    name = name || 'Anonymous'

    if (miner && typeof miner !== 'string') {
        core.error(
            `Invalid miner for mining config ${name} of section ${title}, miner is not a string. Mining config ignored.`
        )
        return
    }
    if (!miner) {
        core.error(
            `miner not specified in mining config ${name} of section ${title}. Mining config ignored.`
        )
    }

    if (outputs && !(outputs instanceof Array)) {
        core.error(
            `Invalid outputs in mining config ${name} of section ${title}, outputs is not a list. Mining config ignored.`
        )
        return
    }
    if (!outputs) {
        core.error(
            `outputs not specified in mining config ${name} of section ${title}. Mining config ignored.`
        )
    }

    const parsedArgs = new Map<string, string | number | boolean | null>()
    if (args) {
        for (const a of args) {
            const value = args[a]
            if (
                typeof value !== 'string' &&
                typeof value !== 'number' &&
                typeof value !== 'boolean' &&
                value !== null
            ) {
                core.warning(
                    `Ignored argument ${a} in section ${title}/${name}: wrong type`
                )
                continue
            }
            parsedArgs.set(a, value)
        }
    }

    const decodedOutputs: MiningConfigOutput[] = miningConfigOutputsFromObject(
        outputs,
        title,
        name
    )

    if (!miner || decodedOutputs.length === 0) return

    return {
        name,
        miner,
        args: parsedArgs,
        outputs: decodedOutputs
    }
}

export function fromObject(o: any): Config {
    const result: Config = new Map()

    if (o instanceof Array)
        throw new Error('Invalid config: should be a dictionary')

    for (const stitle in o) {
        const csection = o[stitle]

        if (!(csection instanceof Array)) {
            core.warning(`Invalid section ${stitle}, ignored`)
            continue
        }

        const miningConfigs: MiningConfig[] = []

        for (const cmc of csection) {
            const mconfig = miningConfigFromObject(cmc, stitle)

            if (mconfig) {
                miningConfigs.push(mconfig)
            }
        }

        result.set(stitle, miningConfigs)
    }

    return result
}
