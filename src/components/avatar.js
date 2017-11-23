import React from 'react'
import PropTypes from 'prop-types'

/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
const Avatar = ({ src }) => {
    return <img src={src} />
}

Avatar.propTypes = {
    /** Does things that only a foo cannn */
    src: PropTypes.string.isRequired,
    /** width of the image. Also determines it height. */
    width: PropTypes.number
}

export default Avatar
