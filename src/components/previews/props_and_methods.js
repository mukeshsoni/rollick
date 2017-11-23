import React from 'react'
import PropTypes from 'prop-types'
import { isFlowType } from '../../component_maker_helpers/prop_value_from_string.js'

import PreviewSectionHeader from './preview_section_header.js'

function getPropName(prop) {
    if (isFlowType(prop)) {
        return prop.flowType.raw || prop.flowType.name || 'Type unknown'
    } else {
        return prop && prop.type ? prop.type.name : 'Type unknown'
    }
}

function getRequiredStatus(prop) {
    if (isFlowType(prop)) {
        return prop.flowType.required
            ? <span style={{ color: '#999' }}>required</span>
            : ''
    } else {
        return prop.required
            ? <span style={{ color: '#999' }}>required</span>
            : ''
    }
}

function getDefaultValue(prop) {
    if (isFlowType(prop)) {
        return prop.defaultValue && prop.defaultValue.value
    } else {
        return prop.default
    }
}

function getPropRow(prop) {
    let columnStyle = {
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        verticalAlign: 'top',
        color: '#333'
    }

    return (
        <tr key={'prop_row_' + prop[0]}>
            <td style={columnStyle}>
                <span style={{ color: '#7f9a44', fontSize: '0.9em' }}>
                    <code
                        style={{
                            fontFamily:
                                'Consolas, "Liberation Mono", Menlo, monospace'
                        }}
                    >
                        {prop[0]}
                    </code>
                </span>
            </td>
            <td style={columnStyle}>
                <span style={{ color: '#b77daa', fontSize: '0.9em' }}>
                    <code
                        style={{
                            fontFamily:
                                'Consolas, "Liberation Mono", Menlo, monospace'
                        }}
                    >
                        {getPropName(prop[1])}
                    </code>
                </span>
            </td>
            <td style={columnStyle}>
                {getDefaultValue(prop[1]) || getRequiredStatus(prop[1])}
            </td>
            <td style={columnStyle}>
                <p style={{ color: '#333', margin: 0 }}>
                    {prop[1].description}
                </p>
            </td>
        </tr>
    )
}

class PropsAndMethods extends React.PureComponent {
    render() {
        let tableHeaderStyle = {
            color: '#333',
            paddingRight: 16,
            paddingBottom: 8,
            textAlign: 'left',
            fontWeight: 'bold'
        }

        let { item } = this.props

        return (
            <div>
                <PreviewSectionHeader text="Props and Methods" />
                <table
                    style={{
                        width: '100%',
                        marginBottom: 32,
                        borderCollapse: 'collapse'
                    }}
                >
                    <thead style={{ borderBottom: '1px solid #e8e8e8' }}>
                        <tr>
                            <th style={tableHeaderStyle}>Prop name</th>
                            <th style={tableHeaderStyle}>Type</th>
                            <th style={tableHeaderStyle}>Default</th>
                            <th style={tableHeaderStyle}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(item.props).map(prop =>
                            getPropRow(prop)
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

PropsAndMethods.propTypes = {
    item: PropTypes.object.isRequired
}

export default PropsAndMethods
