import React from 'react'
import PropTypes from 'prop-types'
import './header.css'

export default class EditorHeader extends React.Component {
    render() {
        const { name } = this.props
        return (
            <div className="editor-header">
                <h2>
                    {name}
                </h2>
            </div>
        )
    }
}

EditorHeader.propTypes = {
    name: PropTypes.string.isRequired,
    onFormatClick: PropTypes.func
}
