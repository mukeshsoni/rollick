import * as babylon from 'babylon'

function prop(propName, obj) {
    return obj[propName]
}

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

const getFunctionParamName = prop.bind(null, 'name')

function getAstNodeValueString(node) {
    switch (node.type) {
        case 'Identifier':
            return node.name
        default:
            return JSON.stringify(getPropValueFromAstNode(node))
    }
}

function getStringForExpressionStatement(node) {
    return (
        node.callee.object.name +
        '.' +
        node.callee.property.name +
        '(' +
        node.arguments.map(getAstNodeValueString).join(', ') +
        ')'
    )
}

export function getVariableDeclarationString(node) {
    return (
        node.kind +
        ' ' +
        node.declarations
            .map(declaration => {
                return (
                    declaration.id.name +
                    ' = ' +
                    getAstNodeValueString(declaration.init)
                )
            })
            .join(', ')
    )
}

function getPredicate(node) {
    return (
        getAstNodeValueString(node.left) +
        ' ' +
        node.operator +
        ' ' +
        getAstNodeValueString(node.right)
    )
}

function getIfStatementString(node) {
    let s1 = 'if('
    let s2 = getPredicate(node.test)
    let s3 = ') { '
    let s4 = getFunctionBlockStatementString(node.consequent)
    let s5 = '}'

    let ifPart = s1 + s2 + s3 + s4 + s5

    if (node.alternate) {
        let s6 = ' else {'
        let s7 = getFunctionBlockStatementString(node.alternate)
        let s8 = '}'
        let elsePart = s6 + s7 + s8
        return ifPart + elsePart
    } else {
        return ifPart
    }
}

function getFunctionBlockStatementString(node) {
    let bodyString = node.body
        .map(stmt => {
            switch (stmt.type) {
                case 'ExpressionStatement':
                    return getStringForExpressionStatement(stmt.expression)
                case 'ReturnStatement':
                    return 'return ' + getAstNodeValueString(stmt.argument)
                case 'VariableDeclaration':
                    return getVariableDeclarationString(stmt)
                case 'IfStatement':
                    return getIfStatementString(stmt)
                case 'EmptyStatement':
                    console.log('empty statement', stmt)
                    return ''
                default:
                    console.log(
                        'could not take care of block statement',
                        stmt,
                        stmt.type
                    )
                    return (
                        'Could not get string for this statement type: ' +
                        stmt.type
                    )
            }
        })
        .join(';\n')

    return bodyString
}

function getFunctionValueFromAstNode(node) {
    let start = 'function('

    let params = node.params.map(getFunctionParamName)
    let bodyString = getFunctionBlockStatementString(node.body)

    return new Function(...params.concat(bodyString))
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
        case 'BooleanLiteral':
            return nodeValue.value
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
        case 'JSXExpressionContainer':
            return getPropValueFromAstNode(nodeValue.expression)
        default:
            console.error('Oops! Not handling node type', nodeValue.type)
            return nodeValue.value || ''
    }
}

export function getPropsFromJsxCode(jsxCode) {
    var ast
    try {
        ast = babylon.parse(jsxCode, { plugins: ['jsx'] })
    } catch (e) {
        console.log('Error parsing code', e.toString())
        return {}
    }

    let propsInAst = ast.program.body[0].expression.openingElement.attributes

    return propsInAst.reduce((acc, propInAst) => {
        return {
            ...acc,
            [propInAst.name.name]: getPropValueFromAstNode(propInAst)
        }
    }, {})
}
