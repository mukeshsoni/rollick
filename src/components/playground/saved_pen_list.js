import React from 'react'
import PropTypes from 'prop-types'
import { getSavedPens } from '../../persist.js'

export default class SavedPenList extends React.Component {
    defaultProps = {
        filter: ''
    }

    render() {
        let savedPens = getSavedPens()
        let savedPenItemStyle = {
            padding: '1em',
            cursor: 'pointer'
        }

        return (
            <div>
                {Object.keys(getSavedPens()).map(penId =>
                    <div
                        key={'saved_pen_' + penId}
                        style={savedPenItemStyle}
                        onClick={this.props.onSelect.bind(this, penId)}
                    >
                        {penId}
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
