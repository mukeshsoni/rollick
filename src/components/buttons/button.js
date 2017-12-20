import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './button.css!css'

/**
 * Really good button component which can be customised somewhat
 **/
const Button = ({
    label,
    onClick,
    size = 'large',
    style = {},
    enabled = true,
    children
}) => {
    let classes = classnames('btn', {
        'btn-small': size === 'small',
        disabled: !enabled
    })

    return (
        <button
            onClick={onClick}
            style={{ ...style }}
            disabled={!enabled}
            className={classes}
        >
            {label}
            {typeof children === 'function' && children()}
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
    enabled: PropTypes.bool,
    /**
     * string - size of the button. allowed sizes - 'large', 'small'
     **/
    size: PropTypes.string
}

export default Button
