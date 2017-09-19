import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../buttons/button.js'
import './header.css'

export default class EditorHeader extends React.Component {
    render() {
        const { name, onFormatClick, formatButtonLabel } = this.props
        const buttonStyle = {
            fontSize: '0.8rem',
            padding: 4,
            background: 'rgba(42,42,42,1.0)'
        }

        return (
            <div className="editor-header">
                <h2>
                    {name}
                </h2>
                <Button
                    onClick={onFormatClick}
                    label={formatButtonLabel}
                    style={buttonStyle}
                />
            </div>
        )
    }
}

EditorHeader.propTypes = {
    name: PropTypes.string.isRequired,
    onFormatClick: PropTypes.func,
    formatButtonLabel: PropTypes.string
}

EditorHeader.defaultProps = {
    formatButtonLabel: 'Format code'
}
