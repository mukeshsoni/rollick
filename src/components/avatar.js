import React from 'react'

const Avatar = ({ src }) => {
    return <img src={src} />
}

Avatar.propTypes = {
    src: React.PropTypes.string.isRequired,
    width: React.PropTypes.number
}

export default Avatar
