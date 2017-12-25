import React from 'react'
import PropTypes from 'prop-types'
import Button from '../buttons/button.js'
import openSocket from 'socket.io-client'
import _ from '../../../belt.js'
const socket = openSocket('http://localhost:8008')

function npmNameToCamelCase(npmName) {
    return npmName
        .split('-')
        .map(_.capitalize)
        .join('')
}

export default class InstallFromNpm extends React.Component {
    handlePackageNameChange = e => {
        this.setState({ packageName: e.target.value })
    }

    handleImportNameChange = e => {
        this.setState({ importAs: e.target.value })
    }

    handleInstallClick = () => {
        const { packageName } = this.state

        if (!packageName) {
            return
        }

        this.setState({ installing: true })
        fetch('/install', {
            method: 'POST',
            body: JSON.stringify({ registry: 'npm', packageName })
        })
            .then(response => {
                console.log('Got response from server')
            })
            .catch(e => {
                this.setState({
                    installing: false,
                    installationError: e.toString()
                })
                console.error('POST request for install failed', e.toString())
            })
    }

    subscribeToInstallEvents = () => {
        socket.emit('subscribeToInstalls', 1000)
        socket.on('installation', message => {
            console.log('Got installation message')
            if (message.error) {
                this.setState({
                    installing: false,
                    installationError: message.error
                })
            } else {
                this.props.onInstall({
                    name: message.packageName,
                    version: message.version,
                    importAs: this.state.importAs
                })

                this.setState(
                    {
                        installing: false,
                        installationError: null,
                        npmPackage: {
                            name: message.packageName,
                            version: message.version
                        }
                    },
                    () => {
                        this.props.onInstall &&
                            this.props.onInstall({
                                name: message.packageName,
                                version: message.version,
                                importAs: this.state.importAs
                            })
                    }
                )
            }
        })
    }

    componentWillMount() {
        this.subscribeToInstallEvents()
    }

    constructor(props) {
        super(props)

        this.state = {
            packageName: this.props.defaultPackageName,
            importAs: npmNameToCamelCase(this.props.defaultPackageName),
            installing: false,
            installationError: null,
            npmPackage: null
        }
    }

    render() {
        const {
            installing,
            installationError,
            packageName,
            npmPackage
        } = this.state

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 10
                }}
            >
                <label>Package Name</label>
                <input
                    value={this.state.packageName}
                    onChange={this.handlePackageNameChange}
                    disabled={installing}
                />
                <label>Import as</label>
                <input
                    value={npmNameToCamelCase(this.state.packageName)}
                    onChange={this.handleImportNameChange}
                    disabled={installing}
                />
                <Button
                    label={installing ? 'Installing...' : 'Install'}
                    enabled={!installing}
                    onClick={this.handleInstallClick}
                />
                {installing && <div className="loader" />}
                {installationError && (
                    <div>
                        Error trying to install package - {installationError}
                    </div>
                )}
                {npmPackage && (
                    <div>
                        Package {npmPackage.name}@{npmPackage.version}{' '}
                        successfully installed!
                    </div>
                )}
            </div>
        )
    }
}

InstallFromNpm.propTypes = {
    defaultPackageName: PropTypes.string.isRequired,
    onInstall: PropTypes.func.isRequired
}
