import React from 'react'
import PropTypes from 'prop-types'

/**
  * Really good button component which can be customised somewhat
  **/
const Button = ({ label, onClick, style = {}, enabled = true }) => {
    const buttonStyle = {
        background: enabled ? 'rgba(52,52,52,1.0)' : 'rgba(52,52,52,0.6)',
        fontSize: '0.9rem',
        textShadow: 'none',
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
    /**
      * Label on the button
      **/
    label: PropTypes.string.isRequired,
    /**
      * callback function to call on button click
      **/
    onClick: PropTypes.func.isRequired,
    /**
      * object to pass your custom css styles
      **/
    style: PropTypes.object,
    /**
      * boolean - true means enabled, false means disabled
      **/
    enabled: PropTypes.bool
}

export default Button
