import React from 'react'

export default class Tooltip extends React.Component {
    handleMouseOver = e => {
        this.setState({ showTooltip: true })
    }

    handleMouseOut = e => {
        this.setState({ showTooltip: false })
    }

    constructor(props) {
        super(props)

        this.state = {
            showTooltip: false
        }
    }

    render() {
        const tooltipStyle = {
            position: 'absolute',
            right: '1em',
            top: 0,
            background: 'gray',
            color: 'white',
            maxWidth: 300,
            height: 'auto',
            padding: '1em'
        }

        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                style={{ position: 'relative' }}
            >
                {this.state.showTooltip
                    ? <div style={tooltipStyle}>
                          <pre>
                              {JSON.stringify(this.props.content, null, 4)}
                          </pre>
                      </div>
                    : null}
                {this.props.children}
            </div>
        )
    }
}
