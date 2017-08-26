import React from 'react'

export class App extends React.Component {
    handleClick = () => {
        SystemJS.import('reactpen/component.js').then(com => {
            console.log('component loaded', com)
            this.setState({
                com
            })
        })
    }

    constructor(props) {
        super(props)

        this.state = {
            com: null
        }
    }

    render() {
        const { com } = this.state

        const containerStyle = {
            display: 'grid',
            gridTemplateColumns: '4fr 7fr',
            width: '100vw',
            height: '100vh'
        }

        const leftPaneStyle = {
            display: 'flex',
            flexDirection: 'column'
        }

        const rightPaneStyle = { background: 'gray' }
        const htmlContainerStyle = { flex: 1, background: 'hotpink' }
        const cssContainerStyle = { flex: 1, background: 'aqua' }

        return (
            <div style={containerStyle}>
                <div style={leftPaneStyle}>
                    Left pane
                    <div style={htmlContainerStyle}>Html container</div>
                    <div style={cssContainerStyle}>Css container</div>
                </div>
                <div style={rightPaneStyle}>
                    Right pane
                    {com ? React.createElement(com.default) : null}
                </div>
            </div>
        )
    }
}
