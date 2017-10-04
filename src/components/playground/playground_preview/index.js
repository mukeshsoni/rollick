import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'
window.React = React

function myEval(thisObject, code) {
    return function() {
        return eval(code)
    }.call(thisObject)
}

function validJs(jsToInsert) {
    try {
        myEval(this, jsToInsert)
        return true
    } catch (e) {
        return false
    }
}

export default class PlaygroundPreview extends React.Component {
    getJsxToInsert = () => {
        try {
            return eval(this.props.jsxToInsert)
        } catch (e) {
            return (
                <div>
                    <h4>Error loading jsx</h4>
                    <div>
                        {e.toString()}
                    </div>
                </div>
            )
        }
    }

    getIframeHead = () => {
        return (
            <div>
                <style>
                    {this.props.cssToInsertInIframe.join('\n')}
                    {this.props.cssToInsert}
                </style>
                {this.props.cssFilesToInject.map(cssFilePath => {
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

    constructor(props) {
        super(props)

        this.state = {
            jsxToInsert: this.props.jsxToInsert,
            previousJsxToInsert: React.createElement('span')
        }
    }

    componentWillReceiveProps(nextProps) {
        // This is the crazy part. We insert methods which the user has defined in the JS editor section
        // something like `this.handleThisButtonClick = () => this.setState({...})`
        if (
            nextProps.jsToInsert !== this.props.jsToInsert &&
            validJs.bind(this, nextProps.jsToInsert)
        ) {
            try {
                myEval(this, nextProps.jsToInsert)
            } catch (e) {
                console.error('error loading jsx', e)
            }
        }
    }

    render() {
        if (this.props.loading) {
            return <div className="loader" />
        }

        return (
            <Frame
                style={{
                    width: '100%',
                    height: 600
                }}
                frameBorder={'0'}
                head={this.getIframeHead()}
            >
                <div>
                    {this.getJsxToInsert()}
                </div>
            </Frame>
        )
    }
}

PlaygroundPreview.propTypes = {
    loading: PropTypes.bool,
    jsxToInsert: PropTypes.string.isRequired,
    jsToInsert: PropTypes.string,
    cssToInsert: PropTypes.string,
    cssToInsertInIframe: PropTypes.arrayOf(PropTypes.string),
    cssFilesToInject: PropTypes.arrayOf(PropTypes.string)
}

PlaygroundPreview.defaultProps = {
    loading: false,
    jsxToInsert: '',
    jsToInsert: '',
    cssToInsert: '',
    cssToInsertInIframe: [],
    cssFilesToInject: []
}
