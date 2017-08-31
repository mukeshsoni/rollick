import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ label, onClick, style = {} }) => {
    const buttonStyle = {
        background: '#343436',
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
        <button onClick={onClick} style={{ ...buttonStyle, ...style }}>
            {label}
        </button>
    )
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object
}

export default Button
