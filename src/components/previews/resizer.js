import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Resizer extends React.Component {
    adjustIframeHeight = () => {
        setTimeout(() => {
            const iframeDOMNode = ReactDOM.findDOMNode(this.iframeRef)
            const iframeWindow = this.context.window
            const iframeDocument = this.context.document

            if (iframeWindow && iframeDocument) {
                iframeDOMNode.height = iframeDOMNode.contentWindow.document.body
                    .scrollHeight
                    ? iframeDOMNode.contentWindow.document.body.scrollHeight +
                      'px'
                    : 'auto'
            }

            this.timeoutToken = setTimeout(this.adjustIframeHeight, 500)
        }, 200)
    }

    componentDidMount = () => {
        this.adjustIframeHeight()
    }

    componentDidUpdate = () => {
        this.adjustIframeHeight()
    }

    render() {
        return null
    }
}

Resizer.contextTypes = {
    window: PropTypes.any,
    document: PropTypes.any
}

export default Resizer
