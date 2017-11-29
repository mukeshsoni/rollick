import React from 'react'
import Babel from 'jspm_packages/npm/babel-standalone@6.26.0/babel.min.js'
import sass from 'sass.js'
import { formatCode, cmToPrettierCursorOffset } from './code_formatter.js'

export function transpile(code, oldVal = '') {
    try {
        const babelOutput = Babel.transform(`${code}`, {
            presets: ['react']
        })

        return {
            code,
            transpiledCode: babelOutput.code,
            error: '',
            ast: babelOutput.ast
        }
    } catch (e) {
        console.error('error compiling javascript', e.toString())
        return {
            code,
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

function propsAsJsxKeyValue(component) {
    const { fakeProps } = component

    return Object.keys(component.props).reduce((acc, propName) => {
        if (fakeProps && fakeProps[propName]) {
            return (
                acc + ` ${propName}={${getFakePropValue(fakeProps[propName])}}`
            )
        } else if (component.props[propName].required !== false) {
            return acc + ` ${propName}={''}`
        } else {
            return acc
        }
    }, '')
}

export function componentJsx(component) {
    const propValuePairs = component.props ? propsAsJsxKeyValue(component) : ''
    return `<${component.name} ${propValuePairs}></${component.name}>`
}

export function addCodeToExistingJsx(oldCode = '', cursor, codeToInsert) {
    // need to insert new jsx into the existing jsx code at the right place
    // 1. Right place can be where the cursor is
    // 2. If that throws an error, just append the new jsx to the end of the existing code in editor
    const cursorOffset = cmToPrettierCursorOffset(oldCode, cursor)
    let codeAfterInsertion =
        oldCode.slice(0, cursorOffset) +
        codeToInsert +
        oldCode.slice(cursorOffset + 1)

    let formatted = formatCode(codeAfterInsertion, cursor)

    if (formatted.error) {
        codeAfterInsertion = oldCode + codeToInsert
    }

    return codeAfterInsertion
}

export function addComponentToExistingJsx(oldCode = '', cursor, component) {
    const codeToInsert = componentJsx(component)
    return addComponentToExistingJsx(oldCode, cursor, codeToInsert)
}

// TODO - returning the same css for now while trying to load preview in iframe
export function wrapCss(css) {
    return css
    // return '#' + rightPaneId + ' { ' + css + ' }'
}

export function compileCss(code) {
    return new Promise((resolve, reject) => {
        sass.compile(wrapCss(code), result => {
            if (result.status === 0) {
                resolve({
                    transpiledCode: result.text,
                    error: ''
                })
            } else {
                /* console.error('error converting sass to css', result.message)*/
                reject({ error: result.message })
            }
        })
    })
}
