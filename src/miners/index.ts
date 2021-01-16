import {MinerRegistry} from './models'

import * as adobe from './adobe'
import * as office365 from './office365'
import * as azure from './azure'

export const registry: MinerRegistry = {
    ...adobe.registry,
    ...office365.registry,
    ...azure.registry
}
