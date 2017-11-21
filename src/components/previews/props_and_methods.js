import React from 'react'
import PropTypes from 'prop-types'

import PreviewSectionHeader from './preview_section_header.js'

function getPropRow(prop) {
    return (
        <tr>
            <td>
                {prop[0]}
            </td>
            <td>
                {prop[1].type.name}
            </td>
            <td>
                {prop[1].default ||
                    (prop[1].required &&
                        <span style={{ color: '#999' }}>required</span>)}
            </td>
            <td>
                {prop[1].description}
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
                <table>
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
