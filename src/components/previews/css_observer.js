import React from 'react'
import { dedupe } from '../../../belt.js'

/*
  * HOC which listens on style tag additions to head tag
  * gets the css out of them and passing that css a prop to WrappedComponent
  */
export default function cssObserver(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props)

            this.state = {
                cssToInsertInIframe: []
            }
        }

        componentWillMount() {
            var mo = new MutationObserver(mutations => {
                if (
                    mutations &&
                    mutations.length > 0 &&
                    mutations[0].addedNodes &&
                    mutations[0].addedNodes.length > 0
                ) {
                    const addedNodes = mutations[0].addedNodes
                    if (addedNodes[0].nodeName === 'STYLE') {
                        if (
                            addedNodes[0].innerText.includes(
                                'display: none !important'
                            )
                        ) {
                            console.log(
                                'problem styles',
                                addedNodes[0].innerText
                            )
                        } else {
                            this.setState(
                                {
                                    // TODO - need to dedup the cssToInsertInIframe array
                                    cssToInsertInIframe: dedupe(
                                        this.state.cssToInsertInIframe.concat(
                                            addedNodes[0].innerText
                                        )
                                    )
                                },
                                () => {
                                    addedNodes[0].remove()
                                }
                            )
                        }
                    }
                }
            })

            var config = {
                attributes: true,
                childList: true,
                characterData: true
            }
            mo.observe(document.head, config)
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    cssToInsertInIframe={this.state.cssToInsertInIframe}
                />
            )
        }
    }
}
