import React from 'react'

export default class App extends React.Component {
    handleShowStyleguideClick = () => {
        this.setState({
            showStyleguide: true
        })
    }

    hideStyleguide = () => this.setState({ showStyleguide: false })

    handleAddComponent = (component, jsxCode) => {
        this.setState(
            {
                showStyleguide: false
            },
            () => {
                // the modal is taking some time to close. so putting a fake defer here before adding the component to playground
                setTimeout(
                    () =>
                        this.playgroundRef.addComponentFromStyleguide(
                            component,
                            jsxCode
                        ),
                    1000
                )
            }
        )
    }

    handleKeyDown = e => {
        const keyCode = e.which || e.keyCode

        if (keyCode === 27) {
            // escape
            this.hideStyleguide()
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            showStyleguide: true
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    render() {
        console.log('iframe component loaded')
        const styleguideModalStyle = {
            overlay: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 25
            },
            content: {
                padding: 0
            }
        }

        return <div>new iframe stuff comes here</div>
    }
}
