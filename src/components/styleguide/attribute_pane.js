import React from 'react'
import { isFunctionProp } from './prop_value_from_string.js'

function getTextArea(value, onChangeHandler) {
    return (
        <textarea
            onChange={e => onChangeHandler(e.target.value)}
            value={value}
            style={{
                fontSize: 'inherit',
                border: '1px solid gray',
                borderRadius: 5,
                padding: '1em',
                flexBasis: '70%'
            }}
        />
    )
}

function getInputField(propsMeta, value, onChangeHandler) {
    switch (propsMeta.type.name) {
        case 'bool':
            return (
                <input
                    type="checkbox"
                    checked={value && value.toString() === 'true'}
                    onChange={e => onChangeHandler(e.target.checked)}
                />
            )
        default:
            return getTextArea(value, onChangeHandler)
    }
}

export default class AttributePane extends React.Component {
    handlePropChange = (propName, newValue) => {
        this.setState({
            props: {
                ...this.state.props,
                [propName]: newValue
            }
        })
        this.props.onChange(propName, newValue)
    }

    getAttributes = () => {
        const { component } = this.props

        if (!component) {
            return null
        } else {
            const attributeItemStyle = {
                padding: '1em',
                display: 'flex',
                justifyContent: 'space-between'
            }

            return Object.keys(component.props).map(propName => {
                return (
                    <div
                        style={attributeItemStyle}
                        key={`attribute_${propName}`}
                    >
                        {propName}
                        {getInputField(
                            component.props[propName],
                            this.state.props[propName],
                            this.handlePropChange.bind(this, propName)
                        )}
                    </div>
                )
            })
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            props: this.props.component ? this.props.component.fakeProps : {}
        }
    }

    render() {
        const detailsPaneStyle = {
            flex: 2,
            padding: '1em',
            borderLeft: '1px solid rgba(200,200,200, 0.9)',
            maxHeight: '100%',
            overflow: 'hidden',
            overflowY: 'auto'
        }

        return (
            <div className="styleguide-details-pane" style={detailsPaneStyle}>
                <div style={{ marginBottom: '1em' }}>
                    <h3
                        style={{
                            paddingBottom: '0.5em',
                            borderBottom: '1px solid rgba(200,200,200,0.9)'
                        }}
                    >
                        Attributes
                    </h3>
                </div>
                <div>
                    {this.getAttributes()}
                </div>
            </div>
        )
    }
}
