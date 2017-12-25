import React from 'react'
import PropTypes from 'prop-types'
import Button from '../buttons/button.js'
import InstallFromNpm from './install_from_npm.js'

export default class NoSearchResults extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showNpmInstallScreen: false
        }
    }

    render() {
        if (this.state.showNpmInstallScreen) {
            return (
                <div>
                    <Button
                        label="go back"
                        onClick={() =>
                            this.setState({ showNpmInstallScreen: false })
                        }
                    />
                    <InstallFromNpm
                        defaultPackageName={this.props.searchText}
                        onInstall={this.props.onNpmPackageInstall}
                    />
                </div>
            )
        }

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
                            onClick={() =>
                                this.setState({ showNpmInstallScreen: true })
                            }
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

NoSearchResults.propTypes = {
    searchText: PropTypes.string.isRequired,
    onNpmPackageInstall: PropTypes.func.isRequired
}
