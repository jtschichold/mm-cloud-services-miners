import fetch from 'node-fetch'

import {Miner, MinerRegistry} from './models'

interface GoogleCloudNetblockEndpoint {
    endpoint: string
    service: string
    scope: string
}

const cloudNetblocksMiner: Miner = async _args => {
    // See https://cloud.google.com/compute/docs/faq#find_ip_range
    const response = await fetch('https://www.gstatic.com/ipranges/cloud.json')
    if (!response.ok)
        throw new Error(`Error retrieving Google Cloud Netblocks list: ${response.status}`)

    const cloudEndpoints = await response.json()

    const result: GoogleCloudNetblockEndpoint[] = []
    for (const cnetblock of (cloudEndpoints?.prefixes || [])) {
        const {ipv4Prefix,ipv6Prefix,service,scope} = cnetblock

        const endpoint = ipv4Prefix || ipv6Prefix
        if (!endpoint)
            continue

        result.push({
            endpoint, scope, service
        })
    }

    return result
}

const netblocksMiner: Miner = async _args => {
    // See https://cloud.google.com/compute/docs/faq#find_ip_range
    const response = await fetch('https://www.gstatic.com/ipranges/goog.json')
    if (!response.ok)
        throw new Error(`Error retrieving Google Netblocks list: ${response.status}`)

    const netblocks = await response.json()

    const result: string[] = []
    for (const netblock of (netblocks?.prefixes || [])) {
        const {ipv4Prefix, ipv6Prefix} = netblock
        const endpoint = ipv4Prefix || ipv6Prefix

        result.push(endpoint)
    }

    return result
}

export const registry: MinerRegistry = {
    GoogleCloudNetblocksMiner: {
        miner: cloudNetblocksMiner,
        defaultFilter: "[].endpoint"
    },
    GoogleNetblocksMiner: {
        miner: netblocksMiner,
        defaultFilter: "[]"
    }
}