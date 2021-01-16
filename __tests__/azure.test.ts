import * as azure from '../src/miners/azure'

test('test azure', async () => {
    const args = new Map()
    args.set('cloud', 'PublicCloud')

    const result = await azure.registry['O365Miner'].miner(args)
})