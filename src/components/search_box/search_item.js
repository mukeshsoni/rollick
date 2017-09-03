import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Button from '../buttons/button'

import './search_item.css'

const SearchItem = ({
    item,
    selected = false,
    onClick,
    onShowPreviewClick,
    withPreview
}) => {
    const itemClasses = classnames('search-list-item', {
        'search-list-item--selected': selected,
        'with-preview': withPreview
    })

    return (
        <div className={itemClasses} onClick={onClick}>
            {item.name}
            <Button
                onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.nativeEvent &&
                        e.nativeEvent.stopImmediatePropagation &&
                        e.nativeEvent.stopImmediatePropagation()
                    onShowPreviewClick()
                }}
                label={withPreview ? "Hide preview" : "Show preview"}
            />
        </div>
    )
}

SearchItem.propTypes = {
    item: PropTypes.shape({ name: PropTypes.string }).isRequired,
    selected: PropTypes.bool,
    withPreview: PropTypes.bool,
    onClick: PropTypes.func.isRequired
}

export default SearchItem
