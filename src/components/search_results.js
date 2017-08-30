import React from 'react'
import classnames from 'classnames'

import './search_results.css'

const SearchItem = ({ item, selected, onClick }) => {
    const itemClasses = classnames('search-list-item', {
        'search-list-item--selected': selected
    })

    return (
        <div className={itemClasses} onClick={onClick}>
            {item.name}
        </div>
    )
}

const SearchResults = ({ items = [], selectedItemIndex = -1, onItemClick }) => {
    if (!items || items.length === 0) {
        return null
    }

    return (
        <div className="search-list-container">
            {items.map((item, index) =>
                <SearchItem
                    key={'search_item_' + index}
                    item={item}
                    selected={selectedItemIndex === index}
                    onClick={onItemClick.bind(null, item)}
                />
            )}
        </div>
    )
}

export default SearchResults
