import React from 'react'
import PropTypes from 'prop-types'

import PreviewSectionHeader from './preview_section_header.js'

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
                        {prop[1].type.name}
                    </code>
                </span>
            </td>
            <td style={columnStyle}>
                {prop[1].default ||
                    (prop[1].required &&
                        <span style={{ color: '#999' }}>required</span>)}
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
