import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'
import loadComponentFromPath from '../playground/load_component_from_path.js'
import faker from '../../faker.js'

// TODO - need to get css for the component in here
export default class SingleComponentPreview extends React.Component {
    getIframeHead() {
        return (
            <div>
                <style>
                    {this.state.cssToInsertInIframe}
                </style>
                {this.state.cssFilesToInject.map(cssFilePath => {
                    return (
                        <link
                            key={'link_tag_' + cssFilePath}
                            type="text/css"
                            rel="stylesheet"
                            href={cssFilePath}
                        />
                    )
                })}
            </div>
        )
    }

    globalCssLinks = () => {
        // get global css which user wants to inject to all preview panes. In our case, the iframes
        SystemJS.import('/rollick.config.js').then(config => {
            if (
                config.globals &&
                config.globals.css &&
                config.globals.css.urls
            ) {
                this.setState({
                    cssFilesToInject: this.state.cssFilesToInject.concat(
                        config.globals.css.urls
                    )
                })
            }
        })
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

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            component: null,
            fakeProps: {},
            error: null,
            cssToInsertInIframe: '',
            cssFilesToInject: []
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
        this.globalCssLinks()

        var mo = new MutationObserver(mutations => {
            if (
                mutations &&
                mutations.length > 0 &&
                mutations[0].addedNodes &&
                mutations[0].addedNodes.length > 0
            ) {
                const addedNodes = mutations[0].addedNodes
                if (addedNodes[0].nodeName === 'STYLE') {
                    if (
                        addedNodes[0].innerText.includes(
                            'display: none !important'
                        )
                    ) {
                        console.log('problem styles', addedNodes[0].innerText)
                    } else {
                        this.setState(
                            { cssToInsertInIframe: addedNodes[0].innerText },
                            () => {
                                addedNodes[0].remove()
                            }
                        )
                    }
                }
            }
            console.log('new node added to head')
        })
        var config = { attributes: true, childList: true, characterData: true }
        mo.observe(document.head, config)
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
