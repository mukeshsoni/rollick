import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../../tooltip/index.js'

export default class EditorFooter extends React.Component {
    render() {
        const { errors } = this.props
        const style = {
            display: 'flex',
            flexDirection: 'row-reverse',
            padding: '0.2em',
            paddingRight: '1em',
            alignItems: 'center',
            fontSize: '0.8em',
            color: 'red',
            height: 20,
            background: '#141516'
        }

        return (
            <div style={style}>
                {errors && errors.length > 0 &&
                 <Tooltip position='top' content={errors}><span>Errors</span></Tooltip>}
            </div>
        )
    }
}

EditorFooter.propTypes = {
    errors: PropTypes.string
}

EditorFooter.defaultProps = {
    errors: ''
}
