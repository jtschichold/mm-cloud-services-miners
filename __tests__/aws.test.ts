jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')
import * as fs from 'fs'

import * as aws from '../src/miners/aws'
const {Response} = jest.requireActual('node-fetch')

test('test AWSIPRangesMiner', async () => {
    // setup mock
    fetchMock.get(
        'https://ip-ranges.amazonaws.com/ip-ranges.json',
        new Response(
            fs.readFileSync('./__tests__/data/AWSIPRangesMiner-input.json', {
                encoding: 'utf-8'
            }),
            {
                status: 200
            }
        )
    )
    const expected = JSON.parse(
        fs.readFileSync('./__tests__/data/AWSIPRangesMiner-result.json', {
            encoding: 'utf-8'
        })
    )

    const args = new Map()
    const result = await aws.registry['AWSIPRangesMiner'].miner(args)

    fs.writeFileSync(
        './__tests__/data/AWSIPRangesMiner-result.json',
        JSON.stringify(result, null, 4)
    )

    expect(result).toEqual(expected)
})
