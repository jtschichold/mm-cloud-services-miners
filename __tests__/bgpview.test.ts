jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as bgpview from '../src/miners/bgpview'
const {Response} = jest.requireActual('node-fetch')

test('test BGPViewASNPrefixMiner', async () => {
    // setup mock
    fetchMock.get(
        'https://api.bgpview.io/asn/137/prefixes',
        new Response(
            fs.readFileSync(
                './__tests__/data/BGPViewASNPrefixMiner-input.json',
                {encoding: 'utf-8'}
            ),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync('./__tests__/data/BGPViewASNPrefixMiner-result.json', {
            encoding: 'utf-8'
        })
    )

    const args = new Map()
    args.set('autonomous_system', 'AS137')
    const result = await bgpview.registry['BGPViewASNPrefixMiner'].miner(args)

    expect(result).toEqual(expected)
})
