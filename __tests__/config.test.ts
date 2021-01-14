import * as jsyaml from 'js-yaml'
import * as fs from 'fs'

import * as config from '../src/config'

test('test adobe', async () => {
    const readConfig = jsyaml.load(
        fs.readFileSync('./__tests__/test-config.yml', {encoding: 'utf-8'}),
        {schema: jsyaml.JSON_SCHEMA}
    )
    if (typeof readConfig !== 'object' || !readConfig)
        throw new Error(
            'Invalid configuration file: should contain a dictionary'
        )

    config.fromObject(readConfig)
})
