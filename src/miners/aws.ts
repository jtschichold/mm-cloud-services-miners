import fetch from 'node-fetch'
import * as jmespath from '@metrichor/jmespath'

import {Miner, MinerRegistry} from './models'

interface AWSEndpoint extends jmespath.JSONObject {
    endpoint: string
    service: string
    region: string
    network_border_group: string
}

const iprangesMiner: Miner = async _args => {
    // See https://docs.aws.amazon.com/general/latest/gr/aws-ip-ranges.html
    const response = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json')
    if (!response.ok)
        throw new Error(`Error retrieving AWS IP Ranges list: ${response.status}`)

    const cloudEndpoints = await response.json()

    const result: AWSEndpoint[] = []
    for (const cprefix of (cloudEndpoints?.prefixes || [])) {
        const {ip_prefix: endpoint,region,service,network_border_group} = cprefix
        if (!endpoint)
            continue

        result.push({
            endpoint, region, service, network_border_group
        })
    }
    for (const cprefix of (cloudEndpoints?.ipv6_prefixes || [])) {
        const {ipv6_prefix: endpoint,region,service,network_border_group} = cprefix
        if (!endpoint)
            continue

        result.push({
            endpoint, region, service, network_border_group
        })
    }

    return result
}

export const registry: MinerRegistry = {
    AWSIPRangesMiner: {
        miner: iprangesMiner,
        endpointAttribute: 'endpoint',
        defaultFilter: "[].endpoint"
    }
}