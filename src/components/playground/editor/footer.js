import React from 'react'
import PropTypes from 'prop-types'

export default class EditorFooter extends React.Component {
    render() {
        return (
            <div>
                {errors && errors.length > 0 && errors.length}
            </div>
        )
    }
}

EditorFooter.propTypes = {
    errors: PropTypes.arrayOf(
        PropTypes.shape({
            message: PropTypes.string.isRequired
        })
    )
}

EditorFooter.defaultProps = {
    errors: []
}
