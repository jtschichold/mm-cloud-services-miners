import fetch from 'node-fetch'

import {Miner, MinerRegistry} from './models'

interface O365Endpoint {
    instance: string
    serviceArea: string
    serviceAreaDisplayName: string
    tcpPorts: string
    expressRoute: boolean
    category: string
    required: boolean
    endpoint: string
    endpointType: string
}

const o365Miner: Miner = async args => {
    const result: O365Endpoint[] = []

    let o365Instance = args.get('instance') || 'Worldwide'
    if (typeof o365Instance !== 'string') {
        throw new Error('instance argument of O365Miner should be a valid O365 Instance.')
    }
    const clientGuid = process.env.O365MINER_CLIENT_GUID
    if (!clientGuid) {
        throw new Error('O365MINER_CLIENT_GUID environment variable not defined. Should be set to a valid GUID.')
    }

    return result
}

export const registry: MinerRegistry = {
    O365Miner: {
        miner: o365Miner,
        defaultFilter: "[?endpointType=='ip'].endpoint"
    }
}
