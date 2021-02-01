import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import * as jmespath from '@metrichor/jmespath'

import {Miner, MinerRegistry} from './models'

interface RADBRegisteredRoutePrefix extends jmespath.JSONObject {
    route: string
    descr: string
    origin: string
    mntBy: string
    source: string
}

const asRRMiner: Miner = async args => {
    const whoisRegex = /^([a-z0-9-]+):\s+(.*)$/gm
    const result: RADBRegisteredRoutePrefix[] = []

    const asID = args.get('autonomous_system')
    if (!asID) 
        throw new Error(`autonomous_system argument is required.`)

    const fetchResponse = await fetch(
        `https://www.radb.net/query?advanced_query=1&keywords=${asID}&-T+option=&ip_option=&-i=1&-i+option=origin`
    )
    if (!fetchResponse.ok)
        throw new Error(
            `Error fetching AS Registered Routes page: ${fetchResponse.status}`
        )

    const $ = cheerio.load(await fetchResponse.text())

    $('pre.query-result > code').map((_idx, e) => {
        const rrecord = $(e).text().trim()
        const newPrefix: {[key: string]: string} = {}
        let rematch

        while ((rematch = whoisRegex.exec(rrecord)) !== null) {
            const key = rematch[1]
            const value = rematch[2]

            if (key === "route" || key === "route6") {
                newPrefix.route = value
                continue
            }
            if (key === "mnt-by") {
                newPrefix.mntBy = value
                continue
            }
            if (["descr", "origin", "source"].includes(key)) {
                newPrefix[key] = value
                continue
            }
        }

        if (newPrefix.route) {
            result.push({
                route: newPrefix.route,
                mntBy: newPrefix.mntBy,
                descr: newPrefix.descr,
                origin: newPrefix.origin,
                source: newPrefix.source
            })
        }
    })

    return result
}

export const registry: MinerRegistry = {
    RADBASRegisterdRoutesMiner: {
        miner: asRRMiner,
        defaultFilter: '[].route'
    }
}
