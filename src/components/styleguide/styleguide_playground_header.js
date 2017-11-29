import React from 'react'
import PropTypes from 'prop-types'

class StyleguidePlaygroundHeader extends React.PureComponent {
    render() {
        let addButtonStyle = {
            outline: 'none',
            cursor: 'pointer'
        }

        let { item, onAddStory } = this.props
        return (
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 42
                }}
            >
                <div>
                    <h2
                        style={{
                            marginBottom: 8,
                            fontWeight: 'normal'
                        }}
                    >
                        {item.name}
                    </h2>
                    <div
                        style={{
                            fontSize: '0.9em',
                            color: '#999'
                        }}
                    >
                        {item.path}
                        <button
                            type="button"
                            title="Copy to clipboard"
                            style={{
                                background: 'transparent',
                                transition: 'color 750ms ease-out',
                                color: '#999',
                                padding: 2,
                                marginLeft: 4,
                                cursor: 'pointer'
                            }}
                        >
                            <svg
                                fill="currentColor"
                                preserveAspectRatio="xMidYMid meet"
                                height="1em"
                                width="1em"
                                viewBox="0 0 40 40"
                                style={{ verticalAlign: 'middle' }}
                            >
                                <g>
                                    <path d="m31.6 35v-23.4h-18.2v23.4h18.2z m0-26.6c1.8 0 3.4 1.4 3.4 3.2v23.4c0 1.8-1.6 3.4-3.4 3.4h-18.2c-1.8 0-3.4-1.6-3.4-3.4v-23.4c0-1.8 1.6-3.2 3.4-3.2h18.2z m-5-6.8v3.4h-20v23.4h-3.2v-23.4c0-1.8 1.4-3.4 3.2-3.4h20z" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={onAddStory}
                >
                    <div
                        style={{
                            background: '#24b987',
                            color: 'white',
                            display: 'inline-block',
                            borderRadius: '50%',
                            width: 42,
                            height: 42,
                            textAlign: 'center',
                            verticalAlign: 'center',
                            fontSize: 36,
                            marginRight: 10,
                            padding: 5
                        }}
                    >
                        +
                    </div>
                    <a style={addButtonStyle}>Add New Story</a>
                </div>
            </header>
        )
    }
}

StyleguidePlaygroundHeader.propTypes = {
    /**
     * UI component object which is output by react-docgen, and enhanced with fakeProps
     **/
    item: PropTypes.object.isRequired,
    /**
     * function to call when user wants to add a new story
     **/
    onAddStory: PropTypes.func.isRequired
}

export default StyleguidePlaygroundHeader
