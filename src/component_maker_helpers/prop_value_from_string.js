export function isFunctionProp(prop) {
    return (
        (prop && prop.type && prop.type.name === 'func') ||
        (prop && prop.flowType && prop.flowType.type === 'function')
    )
}

export function isBoolProp(prop) {
    return (
        (prop && prop.type && prop.type.name === 'bool') ||
        (prop && prop.flowType && prop.flowType.type === 'boolean')
    )
}

function getFunctionFromString(str) {
    try {
        const wrapper = new Function('return ' + str)
        return wrapper()
    } catch (e) {
        return str
    }
}

function getObjectFromString(str) {
    try {
        ;(0, eval)('var obj = ' + str)
        console.log('obj', obj)
        return obj
    } catch (e) {
        console.error('error converting object', e)
        return str
    }
}

function getFlowPropValue(prop, val) {
    switch (prop.flowType.type) {
        case 'function':
            return getFunctionFromString(val)
        default:
            return val
    }
}

export function getPropValue(prop, val) {
    if (prop.flowType) {
        return getFlowPropValue(prop, val)
    } else {
        if (prop.type && prop.type.name) {
            switch (prop.type.name) {
                case 'func':
                    return getFunctionFromString(val)
                case 'object':
                    return getObjectFromString(val)
                default:
                    return val
            }
        } else {
            return val
        }
    }
}

export function populateDefaultValues(props, fakeProps) {
    return {
        ...Object.keys(props).reduce((acc, propName) => {
            if (
                props[propName].defaultValue &&
                props[propName].defaultValue.value
            ) {
                return {
                    ...acc,
                    [propName]: props[propName].defaultValue.value
                }
            } else {
                return acc
            }
        }, {}),
        ...fakeProps
    }
}
