import React from 'react'
import {
    isFunctionProp,
    isObjectProp,
    isArrayProp,
    isBoolProp,
    getPropValue
} from '../../../component_maker_helpers/prop_value_from_string.js'
import './attribute_pane.css'
import Textarea from 'node_modules/react-textarea-autosize/dist/react-textarea-autosize.min.js'
import Tooltip from '../../tooltip/index.js'

// This function exists to convert between some javascript values to values which can be put inside some input component
// E.g. if some prop is a function, We need to convert it to a string before putting it inside a textarea
// Similarly, if the prop is an object, it would should up like [Object Object] if we don't do a JSON.stringify of the object
function serialize(propsMeta, fakeProps) {
    return Object.keys(fakeProps).reduce((acc, propName) => {
        if (isFunctionProp(propsMeta[propName])) {
            return {
                ...acc,
                [propName]: fakeProps[propName].toString()
            }
        } else if (
            isObjectProp(propsMeta[propName]) ||
            isArrayProp(propsMeta[propName])
        ) {
            return {
                ...acc,
                [propName]: JSON.stringify(fakeProps[propName], null, 4)
            }
        } else {
            return {
                ...acc,
                [propName]: fakeProps[propName]
            }
        }
    }, {})
}

// this function is very important
// it converts whatever comes from input (text, boolean, etc.) and converts it to a type which is expected out of it
// e.g. we represent object as string in text area. But user of attribute pane, expect a changed object back
// problem is when the input goes into error state (not valid object). We need to maintain internal state of values and only pass it across when there's a valid
// output
function inputValueToPropValue(prop, oldValue, newValue) {
    if (isObjectProp(prop) || isArrayProp(prop) || isFunctionProp(prop)) {
        return getPropValue(prop, newValue)
    } else {
        return newValue
    }
}

function getTextArea(value, onChangeHandler) {
    // The onChange handler should send back data based the type of the prop and not just strings. It's very difficult for consumer of attribute pane
    // to guess what might come out as a result of onChange
    return (
        <div
            style={{
                padding: '0.4em',
                border: '2px solid #b93d24',
                borderRadius: 3
            }}
        >
            <Textarea
                onChange={e => onChangeHandler(e.target.value)}
                value={value}
                maxRows={10}
                style={{
                    fontSize: 'inherit',
                    padding: '0.2em',
                    width: '100%',
                    resize: 'none',
                    color: '#b93d24',
                    height: 16
                }}
            />
        </div>
    )
}

function getInputField(propsMeta, value, onChangeHandler) {
    if (isBoolProp(propsMeta)) {
        return (
            <input
                type="checkbox"
                checked={value && value.toString() === 'true'}
                onChange={e => onChangeHandler(e.target.checked)}
            />
        )
    } else {
        return getTextArea(value, onChangeHandler)
    }
}

export default class AttributePane extends React.Component {
    handlePropChange = (propName, newValue) => {
        const oldValue = this.state.props[propName]

        this.setState(
            {
                props: {
                    ...this.state.props,
                    [propName]: newValue
                }
            },
            () => {
                this.props.onChange(
                    propName,
                    inputValueToPropValue(
                        this.props.component.props[propName],
                        oldValue,
                        newValue
                    )
                )
            }
        )
    }

    getAttributes = () => {
        const { component } = this.props

        if (!component || !component.props) {
            return null
        } else {
            return Object.keys(component.props).map(propName => {
                return (
                    <div className="form-row" key={`attribute_${propName}`}>
                        <div style={{ flex: 1, alignSelf: 'center' }}>
                            <span style={{ flex: 1 }}>
                                {propName}
                            </span>
                        </div>
                        <div style={{ flex: 3, width: '100%' }}>
                            {getInputField(
                                component.props[propName],
                                this.state.props[propName],
                                this.handlePropChange.bind(this, propName)
                            )}
                        </div>
                        <div className="attribute-help--container">
                            <div className="attribute-help">
                                <Tooltip content={component.props[propName]}>
                                    <span
                                        style={{
                                            marginLeft: '0.3em',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ?
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            props: this.props.component
                ? serialize(
                      this.props.component.props,
                      this.props.component.fakeProps
                  )
                : {}
        }
    }

    componentWillReceiveProps(nextProps) {
        // if this rerender is due to a new component being selected, let's rehydrate the state using the serialize function
        if (
            nextProps.component &&
            this.props.component &&
            (nextProps.component.path !== this.props.component.path ||
                nextProps.component.fakeProps !==
                    this.props.component.fakeProps)
        ) {
            this.setState({
                props: nextProps.component
                    ? serialize(
                          nextProps.component.props,
                          nextProps.component.fakeProps
                      )
                    : {}
            })
        }
    }

    render() {
        const detailsPaneStyle = {
            flex: 2,
            maxHeight: '100%',
            color: '#b93d24',
            marginTop: 28
        }

        return (
            <div style={detailsPaneStyle}>
                <div
                    style={{
                        marginBottom: '0.5em',
                        fontSize: '1.1em',
                        fontFamily: 'Proxima Nova',
                        padding: '0.5em'
                    }}
                >
                    {this.props.component.name + ' properties'}
                </div>
                <div style={{ padding: '1em' }}>
                    {this.getAttributes()}
                </div>
            </div>
        )
    }
}
