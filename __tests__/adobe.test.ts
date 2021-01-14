import * as adobe from '../src/miners/adobe'

test('test adobe', async () => {
    const args = new Map()

    const result = await adobe.registry['AdobeCreativeMiner'](args)
})
