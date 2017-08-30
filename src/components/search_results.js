import React from 'react'

const SearchItem = ({ item }) => {
    return (
        <div>
            {item.name}
        </div>
    )
}

const SearchResults = ({ items = [] }) => {
    return (
        <div>
            {items.map(item => <SearchItem item={item} />)}
        </div>
    )
}

export default SearchResults
