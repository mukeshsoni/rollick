import React from 'react'
import PropTypes from 'prop-types'

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
        const { position } = this.props

        const tooltipStyle = {
            position: 'absolute',
            right: position === 'left' ? '1em' : 0,
            top: position === 'left' ? 0 : 'auto',
            bottom: position === 'left' ? 'auto' : 20,
            background: 'gray',
            color: 'white',
            width: 300,
            height: 'auto',
            padding: '1em',
            wordWrap: 'break-word'
        }

        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                style={{ position: 'relative' }}
            >
                {this.state.showTooltip
                    ? <div style={tooltipStyle}>
                          <pre style={{ whiteSpace: 'pre-wrap' }}>
                              {JSON.stringify(this.props.content, null, 4)}
                          </pre>
                      </div>
                    : null}
                {this.props.children}
            </div>
        )
    }
}

Tooltip.propTypes = {
    content: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['left', 'top']).isRequired,
    children: PropTypes.element.isRequired
}

Tooltip.defaultProps = {
    position: 'left'
}
