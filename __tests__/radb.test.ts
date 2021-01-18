jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as radb from '../src/miners/radb'
const {Response} = jest.requireActual('node-fetch')

test('test RADBASRegisterdRoutesMiner', async () => {
    // mock setup
    fetchMock.get(
        'https://www.radb.net/query?advanced_query=1&keywords=as137&-T+option=&ip_option=&-i=1&-i+option=origin',
        new Response(
            fs.readFileSync(
                './__tests__/data/RADBASRegisterdRoutesMiner-input.html',
                {encoding: 'utf-8'}
            ),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync(
            './__tests__/data/RADBASRegisterdRoutesMiner-result.json',
            {
                encoding: 'utf-8'
            }
        )
    )

    const args = new Map()
    args.set('autonomous_system', 'as137')

    const result = await radb.registry['RADBASRegisterdRoutesMiner'].miner(args)

    expect(result).toEqual(expected)
})
