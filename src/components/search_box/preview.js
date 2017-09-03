import React from 'react'
import PropTypes from 'prop-types'

class Preview extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { component } = this.props

        return (
            <div style={{ background: 'cadetblue' }}>
                {React.createElement(
                    component.component,
                    component.meta.fakeProps
                )}
            </div>
        )
    }
}

Preview.propTypes = {
    component: PropTypes.shape({
        component: PropTypes.component,
        meta: PropTypes.object
    })
}

export default Preview
