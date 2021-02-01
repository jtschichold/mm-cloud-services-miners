import fetch from 'node-fetch'

import {Miner, MinerRegistry} from './models'
import * as jmespath from '@metrichor/jmespath'

const BASE_URL = 'https://endpoints.office.com/endpoints'

interface O365Endpoint extends jmespath.JSONObject {
    id: number
    instance: string
    serviceArea: string
    serviceAreaDisplayName: string
    tcpPorts: string
    udpPorts: string
    expressRoute: boolean
    category: string
    required: boolean
    endpoint: string
    endpointType: string
}

type BaseO365Endpoint = Pick<O365Endpoint, "id" | "instance" | "serviceArea" | "serviceAreaDisplayName" | "category" | "expressRoute" | "required" | "tcpPorts" | "udpPorts">

const o365Miner: Miner = async args => {
    const result: O365Endpoint[] = []

    const o365Instance = args.get('instance') || 'Worldwide'
    if (typeof o365Instance !== 'string') {
        throw new Error('instance argument of O365Miner should be a valid O365 Instance.')
    }
    const clientGuid = process.env.O365MINER_CLIENT_GUID
    if (!clientGuid) {
        throw new Error('O365MINER_CLIENT_GUID environment variable not defined. Should be set to a valid GUID.')
    }

    const url = `${BASE_URL}/${o365Instance}?ClientRequestId=${clientGuid}`

    const response = await fetch(url)
    if (!response.ok)
        throw new Error(`Error calling O365 WebService Endpoint: ${response.status}`)

    const o365Endpoints = await response.json()

    for (const egroup of o365Endpoints) {
        const {id, serviceArea, serviceAreaDisplayName, tcpPorts, udpPorts, expressRoute, category, required, ips, urls} = egroup
        const base: BaseO365Endpoint = {
            id,
            serviceArea,
            serviceAreaDisplayName,
            tcpPorts,
            udpPorts,
            expressRoute,
            category,
            required,
            instance: o365Instance
        }

        for (const epip of (ips || [])) {
            result.push({
                ...base,
                endpoint: epip,
                endpointType: "IP"
            })
        }

        for (const epurl of (urls || [])) {
            result.push({
                ...base,
                endpoint: epurl,
                endpointType: "URL"
            })
        }
    }

    return result
}

export const registry: MinerRegistry = {
    O365Miner: {
        miner: o365Miner,
        endpointAttribute: 'endpoint',
        defaultFilter: "[?endpointType=='IP'].endpoint"
    }
}
