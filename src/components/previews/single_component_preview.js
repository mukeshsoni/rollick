import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'
import loadComponentFromPath from '../playground/load_component_from_path.js'
import faker from '../../faker.js'

// TODO - need to get css for the component in here
export default class SingleComponentPreview extends React.Component {
    getIframeHead() {
        return <div />
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            component: null,
            fakeProps: {},
            error: null
        }
    }

    getComponent = item => {
        loadComponentFromPath(item)
            .then(com => {
                this.setState({
                    loading: false,
                    error: null,
                    component: com.component,
                    // if item has fakeProps, we want to get those. Since they might have changed from attribute pane or whereever
                    fakeProps: com.fakeProps
                })
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    error: e
                })
            })
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.item !== this.props.item &&
            nextProps.item.path !== this.props.item.path
        ) {
            this.getComponent(nextProps.item)
        }
    }

    componentWillMount() {
        this.getComponent(this.props.item)
    }

    render() {
        const { style, item } = this.props
        const { error, component, fakeProps } = this.state

        if (!item) {
            return null
        }

        const containerStyle = {
            width: '100%',
            height: 600,
            ...style
        }

        if (error) {
            return (
                <div>
                    <h4>Error loading component</h4>
                    <div>
                        {error}
                    </div>
                </div>
            )
        } else {
            return (
                <Frame
                    style={containerStyle}
                    frameBorder={'0'}
                    head={this.getIframeHead()}
                >
                    <div>
                        {React.createElement(
                            component,
                            item.fakeProps ? item.fakeProps : fakeProps
                        )}
                    </div>
                </Frame>
            )
        }
    }
}

SingleComponentPreview.propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object
}
