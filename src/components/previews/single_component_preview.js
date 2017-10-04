import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'

// TODO - need to get css for the component in here
export default class SingleComponentPreview extends React.Component {
    getIframeHead() {
        return <div></div>
    }

    constructor(props) {
        super(props)
    }

    render() {
        const { component, fakeProps, style } = this.props

        if(!component) {
            return null
        }

        const containerStyle = {
              width: '100%',
            height: 600,
            ...style
        }

        return (
            <Frame
                style={containerStyle}
                frameBorder={'0'}
                head={this.getIframeHead()}
            >
                <div>
                    {React.createElement(component, fakeProps)}
                </div>
            </Frame>
        )
    }
}

SingleComponentPreview.propTypes = {
    component: PropTypes.element.isRequired,
    fakeProps: PropTypes.object.isRequired,
    style: PropTypes.object
}
