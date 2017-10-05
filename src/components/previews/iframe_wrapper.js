/*
  * HOC which wraps children in iframe
  * And injects newly added css (to head tag in main frame) to the iframe
  */
import React from 'react'
import Frame from 'react-frame-component'
import cssObserver from './css_observer.js'

export default function iframeWrapper(WrappedComponent) {
    class IframeWrapperComponent extends React.Component {
        getIframeHead() {
            return (
                <div>
                    <style>
                        {this.props.cssToInsertInIframe.join('\n')}
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

    return cssObserver(IframeWrapperComponent)
}
