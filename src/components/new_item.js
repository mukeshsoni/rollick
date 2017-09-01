import React from 'react'
import PropTypes from 'prop-types'
import './new_item.css'

const NewItem = ({ name = 'sometihng' }) => {
    return (
        <div>
            Hi <h3>{name}</h3>
        </div>
    )
}

NewItem.propTypes = {
    name: PropTypes.string.isRequired
}

export default NewItem
