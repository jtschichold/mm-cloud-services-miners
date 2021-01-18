jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as office365 from '../src/miners/office365'
import * as uuid from 'uuid'
const {Response} = jest.requireActual('node-fetch')

test('test O365Miner', async () => {
    const clientGuid = uuid.v4()

    // setup mock
    process.env.O365MINER_CLIENT_GUID = clientGuid

    fetchMock.get(
        `https://endpoints.office.com/endpoints/Worldwide?ClientRequestId=${clientGuid}`,
        new Response(
            fs.readFileSync('./__tests__/data/O365Miner-input.json', {
                encoding: 'utf-8'
            }),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync('./__tests__/data/O365Miner-result.json', {
            encoding: 'utf-8'
        })
    )

    const args = new Map()
    args.set('instance', 'Worldwide')

    const result = await office365.registry['O365Miner'].miner(args)

    expect(result).toEqual(expected)
})
