import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './search_item.css'

class SearchItem extends React.PureComponent {
    render() {
        const { item, selected = true, onClick, className = '' } = this.props
        const itemClasses = classnames('search-list-item', {
            'search-list-item--selected': selected
        })

        return (
            <div
                className={itemClasses + ' ' + className}
                onClick={onClick}
                ref={node => (this.containerRef = node)}
            >
                {item.name}
            </div>
        )
    }
}

SearchItem.propTypes = {
    item: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
    selected: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
}

export default SearchItem
