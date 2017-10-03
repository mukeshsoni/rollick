import React from 'react'
import Babel from 'jspm_packages/npm/babel-standalone@6.26.0/babel.min.js'
import { formatCode, cmToPrettierCursorOffset } from './code_formatter.js'
import {
    getPropValue,
    populateDefaultValues
} from '../../component_maker_helpers/prop_value_from_string.js'
import faker from '../../faker.js'

export function transpile(code, oldVal = '') {
    try {
        const babelOutput = Babel.transform(`${code}`, {
            presets: ['react']
        })

        return {
            transpiledCode: babelOutput.code,
            error: '',
            ast: babelOutput.ast
        }
    } catch (e) {
        console.error('error compiling javascript', e.toString())
        return {
            transpiledCode: oldVal,
            error: e.toString()
        }
    }
}
// oldVal is a hack until we have Either data type support
export function jsxToJs(jsxCode, oldVal = '') {
    return transpile(`<div>${jsxCode}</div>`)
}

function getFakePropValue(fakeProp) {
    if (typeof fakeProp === 'function') {
        return fakeProp.toString()
    } else {
        return JSON.stringify(fakeProp)
    }
}

export function addComponent(
    jsx,
    codeMirror,
    componentDetails,
    addToEnd = false
) {
    let codeToInsert = `<${componentDetails.name} `
    let propValuePairs = ''
    if (componentDetails.props) {
        let fakeProps

        if (componentDetails.fakeProps) {
            fakeProps = componentDetails.fakeProps
        } else {
            fakeProps = populateDefaultValues(
                componentDetails.props,
                faker(componentDetails.props, { optional: false })
            )
        }
        propValuePairs = Object.keys(
            componentDetails.props
        ).reduce((acc, propName) => {
            if (fakeProps && fakeProps[propName]) {
                return (
                    acc +
                    ` ${propName}={${getFakePropValue(fakeProps[propName])}}`
                )
            } else if (componentDetails.props[propName].required !== false) {
                return acc + ` ${propName}={'https://unsplash.it/250/250'}`
            } else {
                return acc
            }
        }, '')
    } else {
        propValuePairs = ''
    }

    codeToInsert = `${codeToInsert} ${propValuePairs}></${componentDetails.name}>`

    // TODO - refactor this part
    // setting value in editor, checking if values causes problem and then resetting will not work. Once we set it, it triggers onChange event for the code which leads to all sorts of unpredictable stuff.
    // set codemirror value means mutation. which means bugs which we can't trace easily
    // writing this comment when i actually faced a bug due to this mutation shit
    const oldCode = codeMirror.getValue()
    const cursor = codeMirror.getCursor()
    const cursorOffset = cmToPrettierCursorOffset(oldCode, cursor)
    let codeAfterInsertion =
        oldCode.slice(0, cursorOffset) +
        codeToInsert +
        oldCode.slice(cursorOffset + 1)

    /* codeMirror.replaceSelection(codeToInsert)*/
    let formatted = formatCode(codeAfterInsertion, cursor)

    if (formatted.error) {
        codeAfterInsertion = oldCode + codeToInsert
    }

    return codeAfterInsertion
}
