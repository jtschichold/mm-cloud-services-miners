import * as path from 'path'
import * as readline from 'readline'
import * as fs from 'fs'
import * as jmespath from '@metrichor/jmespath'
import {load} from 'cheerio'
import {assert} from 'console'

interface IgnoreEntryRegex {
    type: 'regex'
    value: RegExp
}

interface IgnoreEntryJMESPath {
    type: 'jmespath'
    value: ReturnType<typeof jmespath.compile>
}

type IgnoreEntry = IgnoreEntryJMESPath | IgnoreEntryRegex

type Ignore = IgnoreEntry[]

const ignoreCache: {[path: string]: Ignore} = {}

async function loadIgnore(p: string): Promise<Ignore | null> {
    let ignoreFileName = `${path.dirname(p)}${path.sep}.mm-miners-ignore`

    if (ignoreCache[ignoreFileName]) {
        return ignoreCache[ignoreFileName]
    }

    let result: Ignore = []

    let fileStream: fs.ReadStream
    try {
        fileStream = fs.createReadStream(ignoreFileName, 'utf-8')
    } catch (error) {
        return null
    }

    const readLine = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    for await (const line of readLine) {
        if (line.startsWith('#')) {
            continue
        }

        const trimmedLine = line.trim()
        if (trimmedLine.length === 0) {
            continue
        }

        try {
            let compiledJMESPath = jmespath.compile(trimmedLine)
            result.push({
                type: 'jmespath',
                value: compiledJMESPath
            })
        } catch (_e) {
            let compiledRegExp = new RegExp(trimmedLine)
            result.push({
                type: 'regex',
                value: compiledRegExp
            })
        }
    }

    ignoreCache[ignoreFileName] = result

    return result
}

export async function applyIgnore(
    p: string,
    epAttribute: string,
    entries: jmespath.JSONArray
): Promise<typeof entries> {
    if (entries.length === 0) return []

    let ignore = await loadIgnore(p)
    if (!ignore) return entries

    if (typeof entries[0] === 'string') {
        return (entries as string[]).filter(e => {
            let ignored = (ignore as IgnoreEntry[]).find(i => {
                if (i.type === 'regex') {
                    return i.value.test(e)
                }

                // jmespath
                return jmespath.TreeInterpreter.search(i.value, e) !== false
            })

            return typeof ignored !== 'undefined'
        })
    }

    return (entries as jmespath.JSONObject[]).filter(e => {
        let ignored = (ignore as IgnoreEntry[]).find(i => {
            if (i.type === 'regex') {
                if (!e[epAttribute] || typeof e[epAttribute] !== 'string')
                    return false
                return i.value.test(e[epAttribute] as string)
            }

            // jmespath
            return jmespath.TreeInterpreter.search(i.value, e) !== false
        })

        return typeof ignored !== 'undefined'
    })
}
