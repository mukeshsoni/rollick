import React from 'react'
import PropTypes from 'prop-types'
import loadComponentFromPath from '../playground/load_component_from_path.js'
import faker from '../../faker.js'
import iframeWrapper from './iframe_wrapper.js'
import '../styleguide/loader.css'
import { jsxToJs } from '../playground/transpile_helpers.js'

class SingleComponentPreview extends React.Component {
    getComponent = item => {
        loadComponentFromPath(item)
            .then(com => {
                window[item.name] = com.component.default || com.component
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

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            component: null,
            fakeProps: {},
            error: null
        }
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
        const { item, jsxCode } = this.props
        const { loading, error, component, fakeProps } = this.state

        if (!item) {
            return null
        }

        if (loading) {
            return <div className="loader" />
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
                <div>
                    <div
                        style={{
                            padding: 16,
                            border: '1px solid #e8e8e8',
                            borderRadius: 3,
                            marginBottom: 32
                        }}
                    >
                        {jsxCode
                            ? eval(jsxToJs(jsxCode).transpiledCode)
                            : React.createElement(
                                  component,
                                  item.fakeProps ? item.fakeProps : fakeProps
                              )}
                    </div>
                </div>
            )
        }
    }
}

SingleComponentPreview.propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object,
    cssUrlsToInsert: PropTypes.arrayOf(PropTypes.string),
    jsUrlsToInsert: PropTypes.arrayOf(PropTypes.string),
    jsxCode: PropTypes.string
}

SingleComponentPreview.defaultProps = {
    style: {},
    cssUrlsToInsert: [],
    jsUrlsToInsert: []
}

export default iframeWrapper(SingleComponentPreview)
