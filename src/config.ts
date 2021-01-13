/* eslint-disable @typescript-eslint/no-explicit-any */

import * as core from '@actions/core'

export interface ConfigSection {
  miner: string
  args: Map<string, string | number | boolean | null>
  resultPath: string
}

export type Config = Map<string, ConfigSection>

export function fromObject(o: any): Config {
  const result: Config = new Map()

  if (o instanceof Array)
    throw new Error('Invalid config: should be a dictionary')

  for (const stitle of o) {
    const csection = o[stitle]

    if (typeof csection !== 'object' || csection === null) {
      core.warning(`Invalid section ${stitle}, ignored`)
      continue
    }

    const {miner, args, resultPath} = csection

    if (!miner) {
      core.warning(`miner not specified in section ${stitle}, section ignored`)
    }
    if (!resultPath) {
      core.warning(
        `resultPath not specified in section ${stitle}, section ignored`
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
          core.warning(`Ignored argument ${a} in section ${stitle}: wrong type`)
        }
        parsedArgs.set(a, value)
      }
    }

    if (!miner || !resultPath) continue

    result.set(stitle, {
      miner,
      resultPath,
      args: parsedArgs
    })
  }

  return result
}
