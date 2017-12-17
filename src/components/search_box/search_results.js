import React from 'react'
import SearchItem from './search_item.js'
import PropTypes from 'prop-types'

import { scrollTo } from '../../tools/dom.js'
import './search_results.css'

class SearchResults extends React.PureComponent {
    ensureHighlightedElementInView = () => {
        if (
            this.containerRef &&
            this.selectedItemRef &&
            this.selectedItemRef.containerRef
        ) {
            scrollTo(this.containerRef, this.selectedItemRef.containerRef)
        }
    }

    componentDidMount() {
        this.ensureHighlightedElementInView()
    }

    componentDidUpdate() {
        this.ensureHighlightedElementInView()
    }

    render() {
        const { items = [], selectedItemIndex = -1, onItemClick } = this.props
        if (!items || items.length === 0) {
            return null
        }

        return (
            <div
                className="search-list-container"
                ref={node => (this.containerRef = node)}
            >
                {items.map((item, index) => (
                    <SearchItem
                        key={'search_item_' + index}
                        item={item}
                        ref={node => {
                            if (selectedItemIndex === index)
                                this.selectedItemRef = node
                        }}
                        selected={selectedItemIndex === index}
                        onClick={e =>
                            typeof onItemClick === 'function' &&
                            onItemClick(item)
                        }
                        onShowPreviewClick={() =>
                            onShowPreviewClick && onShowPreviewClick(item)
                        }
                    />
                ))}
            </div>
        )
    }
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
