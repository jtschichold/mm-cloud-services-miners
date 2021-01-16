import * as office365 from '../src/miners/office365'
import * as uuid from 'uuid'

test('test office365', async () => {
    const args = new Map()
    args.set('instance', 'Worldwide')

    process.env.O365MINER_CLIENT_GUID = uuid.v4()

    const result = await office365.registry['O365Miner'].miner(args)
})
