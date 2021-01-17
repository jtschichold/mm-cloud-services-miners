jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as azure from '../src/miners/azure'
const {Response} = jest.requireActual('node-fetch')

test('test AzureWithServiceTagsMiner', async () => {
    // setup mock
    fetchMock.get(
        'https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519',
        new Response(
            '<html><body><a class="failoverLink" href="http://example.com/mockAzure.json"/></body></html>',
            {
                status: 200
            }
        )
    )
    fetchMock.get(
        'http://example.com/mockAzure.json',
        new Response(
            fs.readFileSync(
                './__tests__/data/AzureWithServiceTagsMiner-input.json',
                {encoding: 'utf-8'}
            ),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync('./__tests__/data/AzureWithServiceTagsMiner-result.json', {
            encoding: 'utf-8'
        })
    )

    const args = new Map()
    args.set('cloud', 'PublicCloud')

    const result = await azure.registry['AzureWithServiceTagsMiner'].miner(args)

    expect(result).toEqual(expected)
})
