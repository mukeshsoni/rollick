import { transpile } from './transpile_helpers.js'

function getStringValueFromAstNode(node) {
    return node.value
}

function getObjectValueFromAstNode(node) {
    let final = node.properties.reduce((acc, prop) => {
        return Object.assign({}, acc, {
            [prop.key.name]: getPropValueFromAstNode(prop)
        })
    }, {})
    return final
}

function getArrayValueFromAstNode(node) {
    return node.elements.map(prop => {
        return getPropValueFromAstNode(prop)
    })
}

function getFunctionValueFromAstNode(node) {
    return 'TODO - should show the function body'
}

function getPropValueFromAstNode(node) {
    let nodeValue = node
    // TODO - the need to check if the node should be considered or node.value means i don't understand the tree completely
    // the final code should be simpler than this
    if (node.value && node.value.type) {
        nodeValue = node.value
    }
    switch (nodeValue.type) {
        case 'StringLiteral':
            return getStringValueFromAstNode(nodeValue)
        case 'ObjectExpression':
            return getObjectValueFromAstNode(nodeValue)
        case 'ArrayExpression':
            return getArrayValueFromAstNode(nodeValue)
        case 'ObjectProperty':
            return nodeValue.value
        case 'NumericLiteral':
            return nodeValue.value
        case 'FunctionExpression':
            return getFunctionValueFromAstNode(nodeValue)
        default:
            console.error('Oops! Not handling node type', node.type)
            return nodeValue.value || ''
    }
}

export function getPropsFromJsxCode(oldFakeProps, jsxCode) {
    let newFakeProps = { ...oldFakeProps }
    let transpiledCode = transpile(jsxCode)

    if (transpiledCode.error) {
        return oldFakeProps
    } else {
        // let ast = babylon.parse(jsxCode, { plugins: ['jsx'] })
        let ast = transpiledCode.ast

        // traverse(babylon.parse(jsxCode, { plugins: ['jsx'] }), {
        //     JSXOpeningElement(node) {
        //         console.log('got a jsx element', node)
        //     }
        // })

        let propsInAst = ast.program.body[0].expression.arguments[1].properties

        return propsInAst.reduce((acc, propInAst) => {
            return {
                ...acc,
                [propInAst.key.name]: getPropValueFromAstNode(propInAst)
            }
        }, {})
    }
}
