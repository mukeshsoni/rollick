import React from 'react'
import PropTypes from 'prop-types'
import { getSavedPensSorted } from '../../persist.js'
import looseFilter from '../../tools/loose_filter.js'

export default class SavedPenList extends React.Component {
    defaultProps = {
        filter: ''
    }

    render() {
        let savedPenItemStyle = {
            padding: '1em',
            cursor: 'pointer'
        }

        return (
            <div>
                {looseFilter(
                    getSavedPensSorted(),
                    'name',
                    this.props.filter
                ).map(pen =>
                    <div
                        key={'saved_pen_' + pen.id}
                        style={savedPenItemStyle}
                        onClick={this.props.onSelect.bind(this, pen.id)}
                    >
                        <div>
                            {pen.name || pen.id}
                        </div>
                        <div>
                            {new Date(pen.modifiedDate).toString()}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

SavedPenList.propTypes = {
    filter: PropTypes.string,
    onSelect: PropTypes.func.isRequired
}
