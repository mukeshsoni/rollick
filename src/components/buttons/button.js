import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ label, onClick, style = {}, enabled = true }) => {
    const buttonStyle = {
        background: enabled ? 'rgba(52,52,52,1.0)' : 'rgba(52,52,52,0.6)',
        fontSize: '1rem',
        textShadow: 'none',
        lineHeight: 1.2,
        padding: 10,
        borderRadius: 3,
        cursor: 'pointer',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        color: 'white'
    }

    return (
        <button
            onClick={onClick}
            style={{ ...buttonStyle, ...style }}
            disabled={!enabled}
        >
            {label}
        </button>
    )
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    enabled: PropTypes.bool
}

export default Button
