import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './search_item.css'

const SearchItem = ({ item, selected = true, onClick, className = '' }) => {
    const itemClasses = classnames('search-list-item', {
        'search-list-item--selected': selected
    })

    return (
        <div className={itemClasses + ' ' + className} onClick={onClick}>
            {item.name}
        </div>
    )
}

SearchItem.propTypes = {
    item: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
    selected: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
}

export default SearchItem
