import React from 'react'
import PropTypes from 'prop-types'

import './search_input.css'

const SearchInput = ({
    value = '',
    className = '',
    placeholder = '',
    onChange,
    onKeyDown,
    onFocus,
    onBlur
}) => {
    return (
        <input
            onKeyDown={onKeyDown}
            className={'search-modal-input' + ' ' + className}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
        />
    )
}

SearchInput.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func
}

export default SearchInput
