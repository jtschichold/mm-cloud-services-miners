import fetch from 'node-fetch'

import {Miner, MinerRegistry} from './models'

interface BGPViewASNPrefix {
    prefix: string
    roa_status: string
    name: string
    description: string
    country_code: string
}

const asnPrefixMiner: Miner = async args => {
    const result: BGPViewASNPrefix[] = []

    let asID = args.get('autonomous_system')
    if (!asID) 
        throw new Error(`autonomous_system argument is required.`)
    if (typeof asID !== 'string' && typeof asID !== 'number')
        throw new Error(`autonomous_system should be a string or an integer`)
    if (typeof asID === 'string' && asID.toLowerCase().startsWith('as')) {
        asID = asID.slice(2)
    }

    const fetchResponse = await fetch(
        `https://api.bgpview.io/asn/${asID}/prefixes`
    )
    if (!fetchResponse.ok)
        throw new Error(
            `Error querying BGPView API: ${fetchResponse.status}`
        )

    const apiResponse = await fetchResponse.json()
    const {status, status_message, data} = apiResponse

    if (status !== 'ok')
        throw new Error(`BGPView API returned an error: ${status} - ${status_message}`)
    if (!data)
        throw new Error('No data from BGPView query')

    const {ipv4_prefixes, ipv6_prefixes} = data
    
    for (const cprefix of (ipv4_prefixes || [])) {
        const {prefix, roa_status, name, country_code, description} = cprefix
        if (!prefix)
            continue

        result.push({
            prefix, roa_status, name, country_code, description
        })
    }
    for (const cprefix of (ipv6_prefixes || [])) {
        const {prefix, roa_status, name, country_code, description} = cprefix
        if (!prefix)
            continue

        result.push({
            prefix, roa_status, name, country_code, description
        })
    }

    return result
}

export const registry: MinerRegistry = {
    BGPViewASNPrefixMiner: {
        miner: asnPrefixMiner,
        defaultFilter: '[].prefix'
    }
}
