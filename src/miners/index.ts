import {MinerRegistry} from './models'

import * as adobe from './adobe'
import * as office365 from './office365'
import * as azure from './azure'
import * as google from './google'
import * as aws from './aws'
import * as radb from './radb'

export const registry: MinerRegistry = {
    ...adobe.registry,
    ...office365.registry,
    ...azure.registry,
    ...google.registry,
    ...aws.registry,
    ...radb.registry
}
