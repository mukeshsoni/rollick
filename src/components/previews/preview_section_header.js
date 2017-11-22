import React from 'react'
import PropTypes from 'prop-types'

class PreviewSectionHeader extends React.PureComponent {
    render() {
        let headerStyle = {
            padding: '8px 0',
            borderBottom: '2px solid #24B981',
            color: '#999',
            textTransition: 'uppercase',
            fontSize: '1.25em',
            marginBottom: 16,
            display: 'inline-block'
        }

        return (
            <div style={headerStyle}>
                {this.props.text}
            </div>
        )
    }
}

PreviewSectionHeader.propTypes = {
    text: PropTypes.string.isRequired
}

export default PreviewSectionHeader
