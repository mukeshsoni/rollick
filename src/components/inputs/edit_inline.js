import React from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

class EditInline extends React.Component {
    handleClickOutside = e => {
        this.setState(
            {
                editing: false
            },
            () => {
                this.props.onChange(this.state.value)
            }
        )
    }

    /**
      * handle keydown documentation
      **/
    handleKeyDown = e => {
        var key = e.keyCode || e.which

        switch (key) {
            case 13: // enter is pressed or escape is pressed
                e.preventDefault()
                this.setState(
                    {
                        editing: false
                    },
                    () => {
                        this.props.onChange(this.state.value)
                    }
                )
                break
            case 27: // escape key
                e.preventDefault()
                this.setState({
                    editing: false,
                    value: this.props.value
                })
                break
        }
    }

    handleChange = e => {
        this.setState({
            value: e.target.value
        })
    }

    constructor(props) {
        super(props)

        this.state = {
            editing: false,
            value: this.props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value })
        }
    }

    render() {
        return (
            <div
                style={{ cursor: 'pointer' }}
                onClick={() =>
                    this.setState({ editing: true }, () => {
                        this.inputRef && this.inputRef.focus()
                        this.inputRef.setSelectionRange(
                            this.props.value.length,
                            this.props.value.length
                        )
                    })}
            >
                {this.state.editing
                    ? <input
                          value={this.state.value}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
                          style={{
                              fontSize: 'inherit',
                              width: '100%',
                              border: '1px solid #23b987',
                              borderRadius: 3,
                              padding: '0.5em',
                              margin: 0
                          }}
                          ref={node => (this.inputRef = node)}
                      />
                    : this.props.value === ''
                      ? 'Click to edit'
                      : this.props.value}
            </div>
        )
    }
}

EditInline.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default onClickOutside(EditInline)
