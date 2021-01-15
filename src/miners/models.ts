import {MiningConfig} from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Miner = (args: MiningConfig['args']) => Promise<string[]|object[]>

export interface MinerRegistry {
    [miner: string]: {
        miner: Miner
        defaultFilter: string
    }
}
