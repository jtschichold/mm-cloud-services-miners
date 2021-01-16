import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

import {Miner, MinerRegistry} from './models'

const CloudURLs = {
    PublicCloud: "https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519",
    ChinaCloud: "https://www.microsoft.com/en-us/download/confirmation.aspx?id=57062",
    USGovernmentCloud: "https://www.microsoft.com/en-us/download/confirmation.aspx?id=57063",
    GermanyCloud: "https://www.microsoft.com/download/confirmation.aspx?id=57064"
}

interface AzureWithServiceTagsEndpoint {
    cloud: string
    name: string
    id: string
    region: string
    regionId: number
    platform: string
    systemService: string
    networkFeatures: string[]
    endpoint: string
}

type BaseAzureWithServiceTagsEndpoint = Pick<AzureWithServiceTagsEndpoint, "id" | "cloud" | "name" | "region" | "regionId" | "platform" | "systemService" | "networkFeatures">

const azureWithServiceTagsMiner: Miner = async args => {
    const result: AzureWithServiceTagsEndpoint[] = []

    const azureCloud = args.get('cloud') || 'PublicCloud'
    if (typeof azureCloud !== 'string' || !Object.keys(CloudURLs).includes(azureCloud)) {
        throw new Error('cloud argument of AzureWithServiceTagsMiner should be a valid Azure cloud.')
    }

    const url = CloudURLs[azureCloud as keyof typeof CloudURLs]

    const response = await fetch(url)
    if (!response.ok)
        throw new Error(`Error retrieving main Azure endpoints webpage for ${azureCloud}: ${response.status}`)

    const $ = cheerio.load(await response.text())
    const jsonURL = $('a.failoverLink').attr('href')
    if (!jsonURL)
        throw new Error(`Failover link not found in Azure endpoints webpage for ${azureCloud}.`)

    const jsonResponse = await fetch(jsonURL)
    if (!jsonResponse.ok)
        throw new Error(`Error accessing failover link for Azure ${azureCloud}: ${jsonResponse.status}`)

    const azureEndpoints = await jsonResponse.json()

    for (const azureService of azureEndpoints) {
        const {name, id, properties} = azureService
        if (!properties) continue
        const {region, regionId, platform, systemService, networkFeatures, addressPrefixes} = properties 
        const base: BaseAzureWithServiceTagsEndpoint = {
            cloud: azureCloud,
            id,
            name,
            region,
            regionId,
            platform,
            systemService,
            networkFeatures
        }

        for (const ep of (addressPrefixes || [])) {
            result.push({
                ...base,
                endpoint: ep,
            })
        }
    }

    return result
}

export const registry: MinerRegistry = {
    AzureWithServiceTagsMiner: {
        miner: azureWithServiceTagsMiner,
        defaultFilter: "[].endpoint"
    }
}
