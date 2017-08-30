import React from 'react'
import PropTypes from 'prop-types'

const Avatar = ({ src }) => {
    return <img src={src} />
}

Avatar.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number
}

export default Avatar
