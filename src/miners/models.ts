import {MiningConfig} from '../config'
import { JSONArray } from '@metrichor/jmespath'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Miner = (args: MiningConfig['args']) => Promise<JSONArray>

export interface MinerRegistry {
    [miner: string]: {
        miner: Miner
        endpointAttribute: string
        defaultFilter: string
    }
}
