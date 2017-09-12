import React from 'react'
import Button from './components/buttons/button'
import Playground from './components/playground/index.js'
import Styleguide from './components/styleguide/index.js'

export default class App extends React.Component {
    toggleView = () => {
        this.setState({
            showPlayground: !this.state.showPlayground
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            showPlayground: true
        }
    }

    render() {
        const headerStyle = {
            display: 'flex',
            flexDirection: 'row-reverse',
            padding: '0.5em'
        }

        return (
            <div>
                <div style={{ headerStyle }}>
                    <Button onClick={this.toggleView} label="Toggle view" />
                </div>
                {this.state.showPlayground ? <Playground /> : <Styleguide />}
            </div>
        )
    }
}
