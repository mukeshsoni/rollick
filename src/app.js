import React from 'react'
import Button from './components/buttons/button'
import Playground from './components/playground/index.js'

import Modal from 'node_modules/react-modal/dist/react-modal.js'
import Styleguide from './components/styleguide/index.js'

/* import Modal from 'react-modal'
 * */
export default class App extends React.Component {
    handleShowStyleguideClick = () => {
        this.setState({
            showStyleguide: true
        })
    }

    hideStyleguide = () => this.setState({ showStyleguide: false })

    handleAddComponent = component => {}

    constructor(props) {
        super(props)
        this.state = {
            showStyleguide: true
        }
    }

    render() {
        const headerStyle = {
            display: 'flex',
            flexDirection: 'row-reverse',
            padding: '0.5em'
        }

        const styleguideModalStyle = {
            style: {
                /* left: 100,
                 * right: 100,
                 * top: 100,
                 * bottom: 100*/
            },
            overlay: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.8)'
            }
        }

        return (
            <div>
                <Modal
                    isOpen={this.state.showStyleguide}
                    onRequestClose={this.hideStyleguide}
                    closeTimeoutMS={1000}
                    style={styleguideModalStyle}
                    contentLabel="Styleguide"
                >
                    <Styleguide onAddComponent={this.handleAddComponent} />
                </Modal>
                <Playground
                    ref={node => (this.playgroundRef = node)}
                    fromStyleguideClick={this.handleShowStyleguideClick}
                />
            </div>
        )
    }
}
