import React from 'react'
import SearchItem from './search_item.js'
import PropTypes from 'prop-types'

import './search_results.css'

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
                    onClick={onItemClick && onItemClick.bind(null, item)}
                />
            )}
        </div>
    )
}

SearchResults.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string
        })
    ).isRequired,
    selectedItemIndex: PropTypes.number,
    onItemClick: PropTypes.func.isRequired
}

export default SearchResults
