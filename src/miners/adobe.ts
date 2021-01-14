import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

import {Miner, MinerRegistry} from './models'

interface AdobeCreativeEndpoint {
    serviceType: string
    serviceName: string
    endpoint: string
}

const adobeCreativeMiner: Miner = async _args => {
    const result: AdobeCreativeEndpoint[] = []

    const fetchResponse = await fetch(
        'https://helpx.adobe.com/in/enterprise/kb/network-endpoints.html'
    )
    if (!fetchResponse.ok)
        throw new Error(
            `Error fetching Adobe Network Endpoints page: ${fetchResponse.status}`
        )

    const $ = cheerio.load(await fetchResponse.text())

    $('tbody').each((_idx, tbody) => {
        const trs = $(tbody).children('tr')

        // check if this is the right type of table
        const firstRow = trs.first()
        const matchServiceType = firstRow
            .children('td')
            .eq(1)
            .text()
            .match(/Service Type:\s*([a-zA-z]+)/)
        if (!matchServiceType) return

        const serviceType = matchServiceType[1]
        const serviceName = firstRow.children('td').first().text().trim()

        trs.each((_idx2, tr) => {
            $(tr)
            .children('td')
            .eq(1)
            .children('p')
            .each((_, urlp) => {
                const $urlp = $(urlp)

                if ($urlp.children().length !== 0) return
                if ($urlp.attr('colspan')) return

                result.push({
                    serviceName,
                    serviceType,
                    endpoint: $urlp.text()
                })
            })
        })
    })

    return result
}

export const registry: MinerRegistry = {
    AdobeCreativeMiner: adobeCreativeMiner
}
