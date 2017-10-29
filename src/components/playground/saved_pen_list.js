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
        let className = 'styleguide-list-item'
        let mutedStyle = {
            color: '#9199a1',
            marginTop: '0.2rem',
            fontSize: '0.7em'
        }

        return (
            <div>
                {looseFilter(
                    getSavedPensSorted(),
                    'name',
                    this.props.filter
                ).map(pen =>
                    <div
                        className={className}
                        key={'saved_pen_' + pen.id}
                        style={savedPenItemStyle}
                        onClick={this.props.onSelect.bind(this, pen.id)}
                    >
                        <div>
                            {pen.name || pen.id}
                        </div>
                        <div style={mutedStyle}>
                            Modified -{' '}
                            {new Date(pen.modifiedDate).toLocaleString()}
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
