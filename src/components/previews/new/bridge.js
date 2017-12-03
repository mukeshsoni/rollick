import React from 'react'
import PropTypes from 'prop-types'
import { setTimeout } from 'timers'

class Bridge extends React.Component {
    constructor(props) {
        super(props)

        this._isMounted = false
        this.state = {
            farSideReady: false
        }
    }

    askFarSideToRender = () => {
        if (this._isMounted) {
            this.context.window.window.renderAgain(
                this.props.item,
                this.props.jsxCode
            )
        }
    }

    callMeWhenReady = () => {
        this.setState({ farSideReady: true })
        if (
            this.context &&
            this.context.window &&
            this.context.window.window &&
            this.context.window.window.renderAgain
        ) {
            this.askFarSideToRender()
        } else {
            console.error(
                'renderAgain function not found in the component inside iframe'
            )
        }
    }

    setOurSideOfTheBridge = () => {
        window.setTimeout(() => {
            if (
                this.context &&
                this.context.window &&
                this.context.window.window
            ) {
                this.context.window.window.callMeWhenReady = this.callMeWhenReady
            }
        }, 500)
    }

    isFarSideThere = () => {
        return (
            this.state.farSideReady ||
            (this.context &&
                this.context.window &&
                this.context.window.window &&
                this.context.window.window.renderAgain)
        )
    }

    updateWhenFarSideReady = () => {
        if (
            this.state.farSideReady ||
            (this.context &&
                this.context.window &&
                this.context.window.window &&
                this.context.window.window.renderAgain)
        ) {
            this.askFarSideToRender()
        } else {
            console.log(
                'Far side not yet ready. Will try again in 500 milliseconds'
            )
            window.setTimeout(this.updateWhenFarSideReady, 500)
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.setOurSideOfTheBridge()
    }

    componentDidUpdate() {
        this.updateWhenFarSideReady()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        if (this.isFarSideThere()) {
            return <span />
        } else {
            return <div className="loader" />
        }
    }
}

Bridge.contextTypes = {
    window: PropTypes.any,
    document: PropTypes.any
}

Bridge.propTypes = {
    item: PropTypes.object.isRequired,
    jsxCode: PropTypes.string.isRequired
}

export default Bridge
