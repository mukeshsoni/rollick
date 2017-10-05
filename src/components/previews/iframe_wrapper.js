/*
  * HOC which wraps children in iframe
  * And injects newly added css (to head tag in main frame) to the iframe
  */
import React from 'react'
import Frame from 'react-frame-component'

export default function iframeWrapper(WrappedComponent) {
    return class extends React.Component {
        getIframeHead() {
            return (
                <div>
                    <style>
                        {this.state.cssToInsertInIframe.join('\n')}
                        {this.props.cssToInsert || ''}
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

        constructor(props) {
            super(props)

            this.state = {
                cssToInsertInIframe: [],
                cssFilesToInject: []
            }
        }

        componentWillMount() {
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
                            console.log(
                                'problem styles',
                                addedNodes[0].innerText
                            )
                        } else {
                            this.setState(
                                {
                                    cssToInsertInIframe: addedNodes[0].innerText
                                },
                                () => {
                                    addedNodes[0].remove()
                                }
                            )
                        }
                    }
                }
                console.log('new node added to head')
            })
            var config = {
                attributes: true,
                childList: true,
                characterData: true
            }
            mo.observe(document.head, config)
        }

        render() {
            const { style } = this.props
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
                    <WrappedComponent {...this.props} />
                </Frame>
            )
        }
    }
}
