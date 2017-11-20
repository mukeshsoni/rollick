import React from 'react'
import PropTypes from 'prop-types'

import PreviewSectionHeader from './preview_section_header.js'

class PreviewCodeSection extends React.PureComponent {
    render() {
        return (
            <div>
                <PreviewSectionHeader text="Code" />
            </div>
        )
    }
}

PreviewCodeSection.propTypes = {
    item: PropTypes.object.isRequired
}

export default PreviewCodeSection
