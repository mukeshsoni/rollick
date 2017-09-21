import React from 'react'
import PropTypes from 'prop-types'
import faker from '../../faker.js'

class Preview extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { component } = this.props

        return (
            <div
                style={{
                    background: 'cadetblue',
                    height: '100%',
                    marginLeft: 10,
                    padding: '1em'
                }}
            >
                {React.createElement(
                    component.component,
                    faker(component.meta.props, { optional: true })
                )}
            </div>
        )
    }
}

Preview.propTypes = {
    component: PropTypes.shape({
        component: PropTypes.component,
        meta: PropTypes.object
    }).isRequired
}

export default Preview
