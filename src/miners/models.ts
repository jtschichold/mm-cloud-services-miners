import {ConfigSection} from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Miner = (args: ConfigSection['args']) => Promise<string[]>

export interface MinerRegistry {
  [miner: string]: Miner
}
