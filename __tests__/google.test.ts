jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as google from '../src/miners/google'
const {Response} = jest.requireActual('node-fetch')

test('test GoogleCloudNetblocksMiner', async () => {
    // setup mock
    fetchMock.get(
        'https://www.gstatic.com/ipranges/cloud.json',
        new Response(
            fs.readFileSync(
                './__tests__/data/GoogleCloudNetblocksMiner-input.json',
                {encoding: 'utf-8'}
            ),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync(
            './__tests__/data/GoogleCloudNetblocksMiner-result.json',
            {
                encoding: 'utf-8'
            }
        )
    )

    const args = new Map()
    const result = await google.registry['GoogleCloudNetblocksMiner'].miner(
        args
    )

    expect(result).toEqual(expected)
})

test('test GoogleNetblocksMiner', async () => {
    // setup mock
    fetchMock.get(
        'https://www.gstatic.com/ipranges/goog.json',
        new Response(
            fs.readFileSync(
                './__tests__/data/GoogleNetblocksMiner-input.json',
                {encoding: 'utf-8'}
            ),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync('./__tests__/data/GoogleNetblocksMiner-result.json', {
            encoding: 'utf-8'
        })
    )

    const args = new Map()
    const result = await google.registry['GoogleNetblocksMiner'].miner(args)

    expect(result).toEqual(expected)
})
