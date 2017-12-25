import React from 'react'
import PropTypes from 'prop-types'
import Button from '../buttons/button.js'

export default class NoSearchResults extends React.Component {
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}
            >
                <div
                    style={{
                        marginTop: '-7%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <p>Couldn't find anything related to your search.</p>
                    <p>You can try refining your search</p>
                    <p>OR</p>
                    <p>Try one of the other options</p>
                    <div style={{ padding: 10, marginTop: 10 }}>
                        <Button
                            label="Install from npm"
                            style={{ marginRight: 10 }}
                            onClick={() => {}}
                        />
                        <Button
                            label="Import from file system"
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
