import React from 'react'

export default class AttributePane extends React.Component {
    getAttributes = () => {
        const { component } = this.props

        function serialize(component, propName) {
            /* try {
             *     return JSON.stringify(component.fakeProps[propName] || '')
             * } catch (e) {*/
            return component.fakeProps[propName] || ''
            /* }*/
        }

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
                        <textarea
                            onChange={e =>
                                this.props.onChange(propName, e.target.value)}
                            value={serialize(component, propName)}
                            style={{
                                fontSize: 'inherit',
                                border: '1px solid gray',
                                borderRadius: 5,
                                padding: '1em',
                                flexBasis: '70%'
                            }}
                        />
                    </div>
                )
            })
        }
    }

    constructor(props) {
        super(props)
    }

    render() {
        const detailsPaneStyle = {
            flex: 2,
            padding: '1em',
            borderLeft: '1px solid rgba(200,200,200, 0.9)'
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
