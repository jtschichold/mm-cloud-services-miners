/* eslint-disable @typescript-eslint/no-explicit-any */

import * as core from '@actions/core'
import * as jmespath from 'jmespath'

export interface MiningConfig {
    name: string
    miner: string
    args: Map<string, string | number | boolean | null>
    resultPath: string
    filter?: string
}

export type Config = Map<string, MiningConfig[]>

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
            const {name, miner, args, resultPath, filter: jFilter} = cmc

            if (!name) {
                core.warning(`Mining config is missing name attribute`)
            }
            if (!miner) {
                core.warning(
                    `miner not specified in section ${stitle}, section ignored`
                )
            }
            if (!resultPath) {
                core.warning(
                    `resultPath not specified in section ${stitle}, section ignored`
                )
            }
            const parsedArgs = new Map<
                string,
                string | number | boolean | null
            >()
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
                            `Ignored argument ${a} in section ${stitle}: wrong type`
                        )
                        continue
                    }
                    parsedArgs.set(a, value)
                }
            }
            if (jFilter) {
                if (typeof jFilter !== 'string') {
                    throw new Error(
                        `Invalid JMESPATH filter in section ${stitle}, should be a string`
                    )
                }
                try {
                    jmespath.search({}, jFilter)
                } catch (error) {
                    throw new Error(
                        `Invalid JMESPATH filter in section ${stitle}: ${error}`
                    )
                }
            }

            if (!miner || !resultPath) continue

            miningConfigs.push({
                name: name || 'Anonymous',
                miner,
                resultPath,
                filter: jFilter,
                args: parsedArgs
            })
        }

        result.set(stitle, miningConfigs)
    }

    return result
}
