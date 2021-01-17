jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as adobe from '../src/miners/adobe'
const {Response} = jest.requireActual('node-fetch')

test('test AdobeCreativeMiner', async () => {
    // mock setup
    fetchMock.get(
        'https://helpx.adobe.com/in/enterprise/kb/network-endpoints.html',
        new Response(
            fs.readFileSync(
                './__tests__/data/AdobeCreativeMiner-network-endpoints.html',
                {encoding: 'utf-8'}
            ),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync('./__tests__/data/AdobeCreativeMiner-response.json', {
            encoding: 'utf-8'
        })
    )

    const args = new Map()

    const result = await adobe.registry['AdobeCreativeMiner'].miner(args)

    expect(result).toEqual(expected)
})
