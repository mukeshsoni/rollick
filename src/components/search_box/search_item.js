import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './search_item.css'

const SearchItem = ({ item, selected = false, onClick }) => {
    const itemClasses = classnames('search-list-item', {
        'search-list-item--selected': selected
    })

    return (
        <div className={itemClasses} onClick={onClick}>
            {item.name}
        </div>
    )
}

SearchItem.propTypes = {
    item: PropTypes.shape({ name: PropTypes.string }).isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired
}

export default SearchItem
