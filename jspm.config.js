SystemJS.config({
    paths: {
        'npm:': 'jspm_packages/npm/',
        'github:': 'jspm_packages/github/',
        'reactpen/': 'src/'
    },
    browserConfig: {
        'baseURL': '/',
        'bundles2': {
            'build.js': [
                'main.js',
                'reactpen/app.js',
                'npm:react@15.6.1/react.js',
                'npm:react@15.6.1.json',
                'npm:jspm-nodelibs-process@0.2.1/process.js',
                'npm:jspm-nodelibs-process@0.2.1.json',
                'npm:react@15.6.1/lib/React.js',
                'npm:react@15.6.1/lib/ReactElementValidator.js',
                'npm:react@15.6.1/lib/lowPriorityWarning.js',
                'npm:fbjs@0.8.14/lib/warning.js',
                'npm:fbjs@0.8.14.json',
                'npm:fbjs@0.8.14/lib/emptyFunction.js',
                'npm:react@15.6.1/lib/getIteratorFn.js',
                'npm:react@15.6.1/lib/canDefineProperty.js',
                'npm:react@15.6.1/lib/checkReactTypeSpec.js',
                'npm:react@15.6.1/lib/ReactComponentTreeHook.js',
                'npm:fbjs@0.8.14/lib/invariant.js',
                'npm:react@15.6.1/lib/ReactCurrentOwner.js',
                'npm:react@15.6.1/lib/reactProdInvariant.js',
                'npm:react@15.6.1/lib/ReactPropTypesSecret.js',
                'npm:react@15.6.1/lib/ReactPropTypeLocationNames.js',
                'npm:react@15.6.1/lib/ReactElement.js',
                'npm:react@15.6.1/lib/ReactElementSymbol.js',
                'npm:object-assign@4.1.1/index.js',
                'npm:object-assign@4.1.1.json',
                'npm:react@15.6.1/lib/onlyChild.js',
                'npm:react@15.6.1/lib/createClass.js',
                'npm:create-react-class@15.6.0/factory.js',
                'npm:create-react-class@15.6.0.json',
                'npm:fbjs@0.8.14/lib/emptyObject.js',
                'npm:react@15.6.1/lib/ReactNoopUpdateQueue.js',
                'npm:react@15.6.1/lib/ReactBaseClasses.js',
                'npm:react@15.6.1/lib/ReactVersion.js',
                'npm:react@15.6.1/lib/ReactPropTypes.js',
                'npm:prop-types@15.5.10/factory.js',
                'npm:prop-types@15.5.10.json',
                'npm:prop-types@15.5.10/factoryWithTypeCheckers.js',
                'npm:prop-types@15.5.10/checkPropTypes.js',
                'npm:prop-types@15.5.10/lib/ReactPropTypesSecret.js',
                'npm:react@15.6.1/lib/ReactDOMFactories.js',
                'npm:react@15.6.1/lib/ReactChildren.js',
                'npm:react@15.6.1/lib/traverseAllChildren.js',
                'npm:react@15.6.1/lib/KeyEscapeUtils.js',
                'npm:react@15.6.1/lib/PooledClass.js',
                'npm:systemjs-plugin-babel@0.0.25/babel-helpers/inherits.js',
                'npm:systemjs-plugin-babel@0.0.25.json',
                'npm:systemjs-plugin-babel@0.0.25/babel-helpers/possibleConstructorReturn.js',
                'npm:systemjs-plugin-babel@0.0.25/babel-helpers/createClass.js',
                'npm:systemjs-plugin-babel@0.0.25/babel-helpers/classCallCheck.js',
                'npm:react-dom@15.6.1/index.js',
                'npm:react-dom@15.6.1.json',
                'npm:react-dom@15.6.1/lib/ReactDOM.js',
                'npm:react-dom@15.6.1/lib/ReactDOMInvalidARIAHook.js',
                'npm:react-dom@15.6.1/lib/DOMProperty.js',
                'npm:react-dom@15.6.1/lib/reactProdInvariant.js',
                'npm:react-dom@15.6.1/lib/ReactDOMNullInputValuePropHook.js',
                'npm:react-dom@15.6.1/lib/ReactDOMUnknownPropertyHook.js',
                'npm:react-dom@15.6.1/lib/EventPluginRegistry.js',
                'npm:react-dom@15.6.1/lib/ReactInstrumentation.js',
                'npm:react-dom@15.6.1/lib/ReactDebugTool.js',
                'npm:fbjs@0.8.14/lib/performanceNow.js',
                'npm:fbjs@0.8.14/lib/performance.js',
                'npm:fbjs@0.8.14/lib/ExecutionEnvironment.js',
                'npm:react-dom@15.6.1/lib/ReactHostOperationHistoryHook.js',
                'npm:react-dom@15.6.1/lib/ReactInvalidSetStateWarningHook.js',
                'npm:react-dom@15.6.1/lib/renderSubtreeIntoContainer.js',
                'npm:react-dom@15.6.1/lib/ReactMount.js',
                'npm:react-dom@15.6.1/lib/shouldUpdateReactComponent.js',
                'npm:react-dom@15.6.1/lib/setInnerHTML.js',
                'npm:react-dom@15.6.1/lib/createMicrosoftUnsafeLocalFunction.js',
                'npm:react-dom@15.6.1/lib/DOMNamespaces.js',
                'npm:react-dom@15.6.1/lib/instantiateReactComponent.js',
                'npm:react@15.6.1/lib/getNextDebugID.js',
                'npm:react-dom@15.6.1/lib/ReactHostComponent.js',
                'npm:react-dom@15.6.1/lib/ReactEmptyComponent.js',
                'npm:react-dom@15.6.1/lib/ReactCompositeComponent.js',
                'npm:fbjs@0.8.14/lib/shallowEqual.js',
                'npm:react-dom@15.6.1/lib/checkReactTypeSpec.js',
                'npm:react-dom@15.6.1/lib/ReactPropTypesSecret.js',
                'npm:react-dom@15.6.1/lib/ReactPropTypeLocationNames.js',
                'npm:react-dom@15.6.1/lib/ReactReconciler.js',
                'npm:react-dom@15.6.1/lib/ReactRef.js',
                'npm:react-dom@15.6.1/lib/ReactOwner.js',
                'npm:react-dom@15.6.1/lib/ReactNodeTypes.js',
                'npm:react-dom@15.6.1/lib/ReactInstanceMap.js',
                'npm:react-dom@15.6.1/lib/ReactErrorUtils.js',
                'npm:react-dom@15.6.1/lib/ReactComponentEnvironment.js',
                'npm:react-dom@15.6.1/lib/ReactUpdates.js',
                'npm:react-dom@15.6.1/lib/Transaction.js',
                'npm:react-dom@15.6.1/lib/ReactFeatureFlags.js',
                'npm:react-dom@15.6.1/lib/PooledClass.js',
                'npm:react-dom@15.6.1/lib/CallbackQueue.js',
                'npm:react-dom@15.6.1/lib/ReactUpdateQueue.js',
                'npm:react-dom@15.6.1/lib/ReactMarkupChecksum.js',
                'npm:react-dom@15.6.1/lib/adler32.js',
                'npm:react-dom@15.6.1/lib/ReactDOMFeatureFlags.js',
                'npm:react-dom@15.6.1/lib/ReactDOMContainerInfo.js',
                'npm:react-dom@15.6.1/lib/validateDOMNesting.js',
                'npm:react-dom@15.6.1/lib/ReactDOMComponentTree.js',
                'npm:react-dom@15.6.1/lib/ReactDOMComponentFlags.js',
                'npm:react-dom@15.6.1/lib/ReactBrowserEventEmitter.js',
                'npm:react-dom@15.6.1/lib/isEventSupported.js',
                'npm:react-dom@15.6.1/lib/getVendorPrefixedEventName.js',
                'npm:react-dom@15.6.1/lib/ViewportMetrics.js',
                'npm:react-dom@15.6.1/lib/ReactEventEmitterMixin.js',
                'npm:react-dom@15.6.1/lib/EventPluginHub.js',
                'npm:react-dom@15.6.1/lib/forEachAccumulated.js',
                'npm:react-dom@15.6.1/lib/accumulateInto.js',
                'npm:react-dom@15.6.1/lib/EventPluginUtils.js',
                'npm:react-dom@15.6.1/lib/DOMLazyTree.js',
                'npm:react-dom@15.6.1/lib/setTextContent.js',
                'npm:react-dom@15.6.1/lib/escapeTextContentForBrowser.js',
                'npm:react-dom@15.6.1/lib/getHostComponentFromComposite.js',
                'npm:react-dom@15.6.1/lib/findDOMNode.js',
                'npm:react-dom@15.6.1/lib/ReactVersion.js',
                'npm:react-dom@15.6.1/lib/ReactDefaultInjection.js',
                'npm:react-dom@15.6.1/lib/SimpleEventPlugin.js',
                'npm:react-dom@15.6.1/lib/getEventCharCode.js',
                'npm:react-dom@15.6.1/lib/SyntheticWheelEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticMouseEvent.js',
                'npm:react-dom@15.6.1/lib/getEventModifierState.js',
                'npm:react-dom@15.6.1/lib/SyntheticUIEvent.js',
                'npm:react-dom@15.6.1/lib/getEventTarget.js',
                'npm:react-dom@15.6.1/lib/SyntheticEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticTransitionEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticTouchEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticDragEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticKeyboardEvent.js',
                'npm:react-dom@15.6.1/lib/getEventKey.js',
                'npm:react-dom@15.6.1/lib/SyntheticFocusEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticClipboardEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticAnimationEvent.js',
                'npm:react-dom@15.6.1/lib/EventPropagators.js',
                'npm:fbjs@0.8.14/lib/EventListener.js',
                'npm:react-dom@15.6.1/lib/SelectEventPlugin.js',
                'npm:react-dom@15.6.1/lib/isTextInputElement.js',
                'npm:fbjs@0.8.14/lib/getActiveElement.js',
                'npm:react-dom@15.6.1/lib/ReactInputSelection.js',
                'npm:fbjs@0.8.14/lib/focusNode.js',
                'npm:fbjs@0.8.14/lib/containsNode.js',
                'npm:fbjs@0.8.14/lib/isTextNode.js',
                'npm:fbjs@0.8.14/lib/isNode.js',
                'npm:react-dom@15.6.1/lib/ReactDOMSelection.js',
                'npm:react-dom@15.6.1/lib/getTextContentAccessor.js',
                'npm:react-dom@15.6.1/lib/getNodeForCharacterOffset.js',
                'npm:react-dom@15.6.1/lib/SVGDOMPropertyConfig.js',
                'npm:react-dom@15.6.1/lib/ReactReconcileTransaction.js',
                'npm:react-dom@15.6.1/lib/ReactInjection.js',
                'npm:react-dom@15.6.1/lib/ReactEventListener.js',
                'npm:fbjs@0.8.14/lib/getUnboundedScrollPosition.js',
                'npm:react-dom@15.6.1/lib/ReactDefaultBatchingStrategy.js',
                'npm:react-dom@15.6.1/lib/ReactDOMTextComponent.js',
                'npm:react-dom@15.6.1/lib/DOMChildrenOperations.js',
                'npm:react-dom@15.6.1/lib/Danger.js',
                'npm:fbjs@0.8.14/lib/createNodesFromMarkup.js',
                'npm:fbjs@0.8.14/lib/getMarkupWrap.js',
                'npm:fbjs@0.8.14/lib/createArrayFromMixed.js',
                'npm:react-dom@15.6.1/lib/ReactDOMTreeTraversal.js',
                'npm:react-dom@15.6.1/lib/ReactDOMEmptyComponent.js',
                'npm:react-dom@15.6.1/lib/ReactDOMComponent.js',
                'npm:react-dom@15.6.1/lib/inputValueTracking.js',
                'npm:react-dom@15.6.1/lib/ReactServerRenderingTransaction.js',
                'npm:react-dom@15.6.1/lib/ReactServerUpdateQueue.js',
                'npm:react-dom@15.6.1/lib/ReactMultiChild.js',
                'npm:react-dom@15.6.1/lib/flattenChildren.js',
                'npm:react-dom@15.6.1/lib/traverseAllChildren.js',
                'npm:react-dom@15.6.1/lib/KeyEscapeUtils.js',
                'npm:react-dom@15.6.1/lib/getIteratorFn.js',
                'npm:react-dom@15.6.1/lib/ReactElementSymbol.js',
                'npm:react-dom@15.6.1/lib/ReactChildReconciler.js',
                'npm:react-dom@15.6.1/lib/ReactDOMTextarea.js',
                'npm:react-dom@15.6.1/lib/LinkedValueUtils.js',
                'npm:react-dom@15.6.1/lib/ReactDOMSelect.js',
                'npm:react-dom@15.6.1/lib/ReactDOMOption.js',
                'npm:react-dom@15.6.1/lib/ReactDOMInput.js',
                'npm:react-dom@15.6.1/lib/DOMPropertyOperations.js',
                'npm:react-dom@15.6.1/lib/quoteAttributeValueForBrowser.js',
                'npm:react-dom@15.6.1/lib/CSSPropertyOperations.js',
                'npm:fbjs@0.8.14/lib/memoizeStringOnly.js',
                'npm:fbjs@0.8.14/lib/hyphenateStyleName.js',
                'npm:fbjs@0.8.14/lib/hyphenate.js',
                'npm:react-dom@15.6.1/lib/dangerousStyleValue.js',
                'npm:react-dom@15.6.1/lib/CSSProperty.js',
                'npm:fbjs@0.8.14/lib/camelizeStyleName.js',
                'npm:fbjs@0.8.14/lib/camelize.js',
                'npm:react-dom@15.6.1/lib/AutoFocusUtils.js',
                'npm:react-dom@15.6.1/lib/ReactComponentBrowserEnvironment.js',
                'npm:react-dom@15.6.1/lib/ReactDOMIDOperations.js',
                'npm:react-dom@15.6.1/lib/HTMLDOMPropertyConfig.js',
                'npm:react-dom@15.6.1/lib/EnterLeaveEventPlugin.js',
                'npm:react-dom@15.6.1/lib/DefaultEventPluginOrder.js',
                'npm:react-dom@15.6.1/lib/ChangeEventPlugin.js',
                'npm:react-dom@15.6.1/lib/BeforeInputEventPlugin.js',
                'npm:react-dom@15.6.1/lib/SyntheticInputEvent.js',
                'npm:react-dom@15.6.1/lib/SyntheticCompositionEvent.js',
                'npm:react-dom@15.6.1/lib/FallbackCompositionState.js',
                'npm:react-dom@15.6.1/lib/ARIADOMPropertyConfig.js'
            ]
        }
    },
    devConfig: {
        'map': {
            'plugin-babel': 'npm:systemjs-plugin-babel@0.0.25',
            'core-js': 'npm:core-js@2.5.0'
        }
    },
    transpiler: 'plugin-babel',
    packages: {
        'reactpen': {
            'main': 'reactpen.js',
            'meta': {
                '*.js': {
                    'loader': 'plugin-babel',
                    'babelOptions': {
                        'plugins': [
                            'babel-plugin-transform-react-jsx'
                        ]
                    }
                },
                '*.css': {
                    'loader': 'css'
                }
            }
        }
    }
});

SystemJS.config({
    packageConfigPaths: [
        'npm:@*/*.json',
        'npm:*.json',
        'github:*/*.json'
    ],
    map: {
        'acorn-jsx': 'npm:acorn-jsx@4.0.1',
        'assert': 'npm:jspm-nodelibs-assert@0.2.1',
        'babel-core': 'npm:babel-core@6.26.0',
        'babel-plugin-transform-react-jsx': 'npm:babel-plugin-transform-react-jsx@6.24.1',
        'buffer': 'npm:jspm-nodelibs-buffer@0.2.3',
        'child_process': 'npm:jspm-nodelibs-child_process@0.2.1',
        'constants': 'npm:jspm-nodelibs-constants@0.2.1',
        'crypto': 'npm:jspm-nodelibs-crypto@0.2.1',
        'css': 'github:systemjs/plugin-css@0.1.35',
        'domain': 'npm:jspm-nodelibs-domain@0.2.1',
        'estraverse': 'npm:estraverse@4.2.0',
        'events': 'npm:jspm-nodelibs-events@0.2.2',
        'fs': 'npm:jspm-nodelibs-fs@0.2.1',
        'http': 'npm:jspm-nodelibs-http@0.2.0',
        'https': 'npm:jspm-nodelibs-https@0.2.2',
        'jsx-transpiler': 'npm:jsx-transpiler@0.1.4',
        'module': 'npm:jspm-nodelibs-module@0.2.1',
        'os': 'npm:jspm-nodelibs-os@0.2.2',
        'path': 'npm:jspm-nodelibs-path@0.2.3',
        'process': 'npm:jspm-nodelibs-process@0.2.1',
        'react': 'npm:react@15.6.1',
        'react-codemirror': 'npm:react-codemirror@1.0.0',
        'react-dom': 'npm:react-dom@15.6.1',
        'react-jsx': 'npm:react-jsx@1.0.0',
        'source-map': 'npm:source-map@0.2.0',
        'stream': 'npm:jspm-nodelibs-stream@0.2.1',
        'string_decoder': 'npm:jspm-nodelibs-string_decoder@0.2.1',
        'url': 'npm:jspm-nodelibs-url@0.2.1',
        'util': 'npm:jspm-nodelibs-util@0.2.2',
        'vm': 'npm:jspm-nodelibs-vm@0.2.1',
        'zlib': 'npm:jspm-nodelibs-zlib@0.2.3'
    },
    packages: {
        'npm:react@15.6.1': {
            'map': {
                'loose-envify': 'npm:loose-envify@1.3.1',
                'object-assign': 'npm:object-assign@4.1.1',
                'create-react-class': 'npm:create-react-class@15.6.0',
                'prop-types': 'npm:prop-types@15.5.10',
                'fbjs': 'npm:fbjs@0.8.14'
            }
        },
        'npm:create-react-class@15.6.0': {
            'map': {
                'fbjs': 'npm:fbjs@0.8.14',
                'loose-envify': 'npm:loose-envify@1.3.1',
                'object-assign': 'npm:object-assign@4.1.1'
            }
        },
        'npm:prop-types@15.5.10': {
            'map': {
                'fbjs': 'npm:fbjs@0.8.14',
                'loose-envify': 'npm:loose-envify@1.3.1'
            }
        },
        'npm:react-dom@15.6.1': {
            'map': {
                'fbjs': 'npm:fbjs@0.8.14',
                'loose-envify': 'npm:loose-envify@1.3.1',
                'object-assign': 'npm:object-assign@4.1.1',
                'prop-types': 'npm:prop-types@15.5.10'
            }
        },
        'npm:fbjs@0.8.14': {
            'map': {
                'loose-envify': 'npm:loose-envify@1.3.1',
                'object-assign': 'npm:object-assign@4.1.1',
                'setimmediate': 'npm:setimmediate@1.0.5',
                'promise': 'npm:promise@7.3.1',
                'ua-parser-js': 'npm:ua-parser-js@0.7.14',
                'isomorphic-fetch': 'npm:isomorphic-fetch@2.2.1',
                'core-js': 'npm:core-js@1.2.7'
            }
        },
        'npm:loose-envify@1.3.1': {
            'map': {
                'js-tokens': 'npm:js-tokens@3.0.2'
            }
        },
        'npm:isomorphic-fetch@2.2.1': {
            'map': {
                'whatwg-fetch': 'npm:whatwg-fetch@2.0.3',
                'node-fetch': 'npm:node-fetch@1.7.2'
            }
        },
        'npm:node-fetch@1.7.2': {
            'map': {
                'encoding': 'npm:encoding@0.1.12',
                'is-stream': 'npm:is-stream@1.1.0'
            }
        },
        'npm:promise@7.3.1': {
            'map': {
                'asap': 'npm:asap@2.0.6'
            }
        },
        'npm:jspm-nodelibs-stream@0.2.1': {
            'map': {
                'stream-browserify': 'npm:stream-browserify@2.0.1'
            }
        },
        'npm:stream-browserify@2.0.1': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'readable-stream': 'npm:readable-stream@2.3.3'
            }
        },
        'npm:encoding@0.1.12': {
            'map': {
                'iconv-lite': 'npm:iconv-lite@0.4.18'
            }
        },
        'npm:readable-stream@2.3.3': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'util-deprecate': 'npm:util-deprecate@1.0.2',
                'isarray': 'npm:isarray@1.0.0',
                'process-nextick-args': 'npm:process-nextick-args@1.0.7',
                'core-util-is': 'npm:core-util-is@1.0.2',
                'safe-buffer': 'npm:safe-buffer@5.1.1',
                'string_decoder': 'npm:string_decoder@1.0.3'
            }
        },
        'npm:jspm-nodelibs-string_decoder@0.2.1': {
            'map': {
                'string_decoder': 'npm:string_decoder@0.10.31'
            }
        },
        'npm:string_decoder@1.0.3': {
            'map': {
                'safe-buffer': 'npm:safe-buffer@5.1.1'
            }
        },
        'npm:jspm-nodelibs-domain@0.2.1': {
            'map': {
                'domain-browser': 'npm:domain-browser@1.1.7'
            }
        },
        'npm:jspm-nodelibs-buffer@0.2.3': {
            'map': {
                'buffer': 'npm:buffer@5.0.7'
            }
        },
        'npm:buffer@5.0.7': {
            'map': {
                'ieee754': 'npm:ieee754@1.1.8',
                'base64-js': 'npm:base64-js@1.2.1'
            }
        },
        'npm:jspm-nodelibs-crypto@0.2.1': {
            'map': {
                'crypto-browserify': 'npm:crypto-browserify@3.11.1'
            }
        },
        'npm:crypto-browserify@3.11.1': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'create-hmac': 'npm:create-hmac@1.1.6',
                'randombytes': 'npm:randombytes@2.0.5',
                'create-hash': 'npm:create-hash@1.1.3',
                'public-encrypt': 'npm:public-encrypt@4.0.0',
                'pbkdf2': 'npm:pbkdf2@3.0.13',
                'browserify-cipher': 'npm:browserify-cipher@1.0.0',
                'browserify-sign': 'npm:browserify-sign@4.0.4',
                'diffie-hellman': 'npm:diffie-hellman@5.0.2',
                'create-ecdh': 'npm:create-ecdh@4.0.0'
            }
        },
        'npm:create-hmac@1.1.6': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'safe-buffer': 'npm:safe-buffer@5.1.1',
                'create-hash': 'npm:create-hash@1.1.3',
                'cipher-base': 'npm:cipher-base@1.0.4',
                'ripemd160': 'npm:ripemd160@2.0.1',
                'sha.js': 'npm:sha.js@2.4.8'
            }
        },
        'npm:randombytes@2.0.5': {
            'map': {
                'safe-buffer': 'npm:safe-buffer@5.1.1'
            }
        },
        'npm:create-hash@1.1.3': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'cipher-base': 'npm:cipher-base@1.0.4',
                'ripemd160': 'npm:ripemd160@2.0.1',
                'sha.js': 'npm:sha.js@2.4.8'
            }
        },
        'npm:public-encrypt@4.0.0': {
            'map': {
                'create-hash': 'npm:create-hash@1.1.3',
                'randombytes': 'npm:randombytes@2.0.5',
                'browserify-rsa': 'npm:browserify-rsa@4.0.1',
                'parse-asn1': 'npm:parse-asn1@5.1.0',
                'bn.js': 'npm:bn.js@4.11.8'
            }
        },
        'npm:browserify-sign@4.0.4': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'create-hash': 'npm:create-hash@1.1.3',
                'create-hmac': 'npm:create-hmac@1.1.6',
                'browserify-rsa': 'npm:browserify-rsa@4.0.1',
                'parse-asn1': 'npm:parse-asn1@5.1.0',
                'elliptic': 'npm:elliptic@6.4.0',
                'bn.js': 'npm:bn.js@4.11.8'
            }
        },
        'npm:diffie-hellman@5.0.2': {
            'map': {
                'randombytes': 'npm:randombytes@2.0.5',
                'bn.js': 'npm:bn.js@4.11.8',
                'miller-rabin': 'npm:miller-rabin@4.0.0'
            }
        },
        'npm:pbkdf2@3.0.13': {
            'map': {
                'safe-buffer': 'npm:safe-buffer@5.1.1',
                'create-hash': 'npm:create-hash@1.1.3',
                'create-hmac': 'npm:create-hmac@1.1.6',
                'ripemd160': 'npm:ripemd160@2.0.1',
                'sha.js': 'npm:sha.js@2.4.8'
            }
        },
        'npm:jspm-nodelibs-os@0.2.2': {
            'map': {
                'os-browserify': 'npm:os-browserify@0.3.0'
            }
        },
        'npm:cipher-base@1.0.4': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'safe-buffer': 'npm:safe-buffer@5.1.1'
            }
        },
        'npm:ripemd160@2.0.1': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'hash-base': 'npm:hash-base@2.0.2'
            }
        },
        'npm:browserify-cipher@1.0.0': {
            'map': {
                'browserify-des': 'npm:browserify-des@1.0.0',
                'evp_bytestokey': 'npm:evp_bytestokey@1.0.2',
                'browserify-aes': 'npm:browserify-aes@1.0.6'
            }
        },
        'npm:sha.js@2.4.8': {
            'map': {
                'inherits': 'npm:inherits@2.0.3'
            }
        },
        'npm:browserify-rsa@4.0.1': {
            'map': {
                'randombytes': 'npm:randombytes@2.0.5',
                'bn.js': 'npm:bn.js@4.11.8'
            }
        },
        'npm:browserify-des@1.0.0': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'cipher-base': 'npm:cipher-base@1.0.4',
                'des.js': 'npm:des.js@1.0.0'
            }
        },
        'npm:parse-asn1@5.1.0': {
            'map': {
                'create-hash': 'npm:create-hash@1.1.3',
                'pbkdf2': 'npm:pbkdf2@3.0.13',
                'evp_bytestokey': 'npm:evp_bytestokey@1.0.2',
                'browserify-aes': 'npm:browserify-aes@1.0.6',
                'asn1.js': 'npm:asn1.js@4.9.1'
            }
        },
        'npm:create-ecdh@4.0.0': {
            'map': {
                'elliptic': 'npm:elliptic@6.4.0',
                'bn.js': 'npm:bn.js@4.11.8'
            }
        },
        'npm:elliptic@6.4.0': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'bn.js': 'npm:bn.js@4.11.8',
                'minimalistic-assert': 'npm:minimalistic-assert@1.0.0',
                'hmac-drbg': 'npm:hmac-drbg@1.0.1',
                'brorand': 'npm:brorand@1.1.0',
                'hash.js': 'npm:hash.js@1.1.3',
                'minimalistic-crypto-utils': 'npm:minimalistic-crypto-utils@1.0.1'
            }
        },
        'npm:hash-base@2.0.2': {
            'map': {
                'inherits': 'npm:inherits@2.0.3'
            }
        },
        'npm:des.js@1.0.0': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
            }
        },
        'npm:hmac-drbg@1.0.1': {
            'map': {
                'hash.js': 'npm:hash.js@1.1.3',
                'minimalistic-assert': 'npm:minimalistic-assert@1.0.0',
                'minimalistic-crypto-utils': 'npm:minimalistic-crypto-utils@1.0.1'
            }
        },
        'npm:evp_bytestokey@1.0.2': {
            'map': {
                'safe-buffer': 'npm:safe-buffer@5.1.1',
                'md5.js': 'npm:md5.js@1.3.4'
            }
        },
        'npm:hash.js@1.1.3': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
            }
        },
        'npm:browserify-aes@1.0.6': {
            'map': {
                'cipher-base': 'npm:cipher-base@1.0.4',
                'create-hash': 'npm:create-hash@1.1.3',
                'inherits': 'npm:inherits@2.0.3',
                'evp_bytestokey': 'npm:evp_bytestokey@1.0.2',
                'buffer-xor': 'npm:buffer-xor@1.0.3'
            }
        },
        'npm:miller-rabin@4.0.0': {
            'map': {
                'bn.js': 'npm:bn.js@4.11.8',
                'brorand': 'npm:brorand@1.1.0'
            }
        },
        'npm:asn1.js@4.9.1': {
            'map': {
                'bn.js': 'npm:bn.js@4.11.8',
                'inherits': 'npm:inherits@2.0.3',
                'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
            }
        },
        'npm:md5.js@1.3.4': {
            'map': {
                'hash-base': 'npm:hash-base@3.0.4',
                'inherits': 'npm:inherits@2.0.3'
            }
        },
        'npm:hash-base@3.0.4': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'safe-buffer': 'npm:safe-buffer@5.1.1'
            }
        },
        'npm:jspm-nodelibs-http@0.2.0': {
            'map': {
                'http-browserify': 'npm:stream-http@2.7.2'
            }
        },
        'npm:stream-http@2.7.2': {
            'map': {
                'inherits': 'npm:inherits@2.0.3',
                'readable-stream': 'npm:readable-stream@2.3.3',
                'to-arraybuffer': 'npm:to-arraybuffer@1.0.1',
                'builtin-status-codes': 'npm:builtin-status-codes@3.0.0',
                'xtend': 'npm:xtend@4.0.1'
            }
        },
        'npm:jspm-nodelibs-url@0.2.1': {
            'map': {
                'url': 'npm:url@0.11.0'
            }
        },
        'npm:jspm-nodelibs-zlib@0.2.3': {
            'map': {
                'browserify-zlib': 'npm:browserify-zlib@0.1.4'
            }
        },
        'npm:browserify-zlib@0.1.4': {
            'map': {
                'readable-stream': 'npm:readable-stream@2.3.3',
                'pako': 'npm:pako@0.2.9'
            }
        },
        'npm:url@0.11.0': {
            'map': {
                'querystring': 'npm:querystring@0.2.0',
                'punycode': 'npm:punycode@1.3.2'
            }
        },
        'npm:react-codemirror@1.0.0': {
            'map': {
                'classnames': 'npm:classnames@2.2.5',
                'create-react-class': 'npm:create-react-class@15.6.0',
                'lodash.isequal': 'npm:lodash.isequal@4.5.0',
                'prop-types': 'npm:prop-types@15.5.10',
                'lodash.debounce': 'npm:lodash.debounce@4.0.8',
                'codemirror': 'npm:codemirror@5.29.0'
            }
        },
        'npm:jsx-transpiler@0.1.4': {
            'map': {
                'acorn-jsx': 'npm:acorn-jsx@0.6.1',
                'estraverse-fb': 'npm:estraverse-fb@1.3.2',
                'esutils': 'npm:esutils@1.1.6',
                'ast-types': 'npm:ast-types@0.3.38',
                'escodegen': 'npm:escodegen@1.8.1',
                'through': 'npm:through@2.3.8'
            }
        },
        'npm:escodegen@1.8.1': {
            'map': {
                'esutils': 'npm:esutils@2.0.2',
                'estraverse': 'npm:estraverse@1.9.3',
                'optionator': 'npm:optionator@0.8.2',
                'esprima': 'npm:esprima@2.7.3'
            }
        },
        'npm:ast-types@0.3.38': {
            'map': {
                'private': 'npm:private@0.1.7'
            }
        },
        'npm:optionator@0.8.2': {
            'map': {
                'wordwrap': 'npm:wordwrap@1.0.0',
                'type-check': 'npm:type-check@0.3.2',
                'deep-is': 'npm:deep-is@0.1.3',
                'prelude-ls': 'npm:prelude-ls@1.1.2',
                'levn': 'npm:levn@0.3.0',
                'fast-levenshtein': 'npm:fast-levenshtein@2.0.6'
            }
        },
        'npm:source-map@0.2.0': {
            'map': {
                'amdefine': 'npm:amdefine@1.0.1'
            }
        },
        'npm:type-check@0.3.2': {
            'map': {
                'prelude-ls': 'npm:prelude-ls@1.1.2'
            }
        },
        'npm:levn@0.3.0': {
            'map': {
                'type-check': 'npm:type-check@0.3.2',
                'prelude-ls': 'npm:prelude-ls@1.1.2'
            }
        },
        'npm:babel-plugin-transform-react-jsx@6.24.1': {
            'map': {
                'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0',
                'babel-helper-builder-react-jsx': 'npm:babel-helper-builder-react-jsx@6.26.0',
                'babel-runtime': 'npm:babel-runtime@6.26.0'
            }
        },
        'npm:babel-helper-builder-react-jsx@6.26.0': {
            'map': {
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'babel-types': 'npm:babel-types@6.26.0',
                'esutils': 'npm:esutils@2.0.2'
            }
        },
        'npm:babel-runtime@6.26.0': {
            'map': {
                'core-js': 'npm:core-js@2.5.0',
                'regenerator-runtime': 'npm:regenerator-runtime@0.11.0'
            }
        },
        'npm:babel-types@6.26.0': {
            'map': {
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'esutils': 'npm:esutils@2.0.2',
                'to-fast-properties': 'npm:to-fast-properties@1.0.3',
                'lodash': 'npm:lodash@4.17.4'
            }
        },
        'npm:react-jsx@1.0.0': {
            'map': {
                'react': 'npm:react@0.14.9',
                'react-dom': 'npm:react-dom@0.14.9',
                'babel-preset-react': 'npm:babel-preset-react@6.24.1',
                'babel-standalone': 'npm:babel-standalone@6.26.0'
            }
        },
        'npm:react@0.14.9': {
            'map': {
                'fbjs': 'npm:fbjs@0.6.1'
            }
        },
        'npm:babel-preset-react@6.24.1': {
            'map': {
                'babel-plugin-transform-react-jsx': 'npm:babel-plugin-transform-react-jsx@6.24.1',
                'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0',
                'babel-preset-flow': 'npm:babel-preset-flow@6.23.0',
                'babel-plugin-transform-react-jsx-self': 'npm:babel-plugin-transform-react-jsx-self@6.22.0',
                'babel-plugin-transform-react-display-name': 'npm:babel-plugin-transform-react-display-name@6.25.0',
                'babel-plugin-transform-react-jsx-source': 'npm:babel-plugin-transform-react-jsx-source@6.22.0'
            }
        },
        'npm:babel-plugin-transform-react-jsx-self@6.22.0': {
            'map': {
                'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0',
                'babel-runtime': 'npm:babel-runtime@6.26.0'
            }
        },
        'npm:babel-plugin-transform-react-jsx-source@6.22.0': {
            'map': {
                'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0',
                'babel-runtime': 'npm:babel-runtime@6.26.0'
            }
        },
        'npm:babel-preset-flow@6.23.0': {
            'map': {
                'babel-plugin-transform-flow-strip-types': 'npm:babel-plugin-transform-flow-strip-types@6.22.0'
            }
        },
        'npm:babel-plugin-transform-react-display-name@6.25.0': {
            'map': {
                'babel-runtime': 'npm:babel-runtime@6.26.0'
            }
        },
        'npm:babel-plugin-transform-flow-strip-types@6.22.0': {
            'map': {
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'babel-plugin-syntax-flow': 'npm:babel-plugin-syntax-flow@6.18.0'
            }
        },
        'npm:babel-core@6.26.0': {
            'map': {
                'private': 'npm:private@0.1.7',
                'babel-types': 'npm:babel-types@6.26.0',
                'babel-messages': 'npm:babel-messages@6.23.0',
                'babel-generator': 'npm:babel-generator@6.26.0',
                'json5': 'npm:json5@0.5.1',
                'babel-helpers': 'npm:babel-helpers@6.24.1',
                'path-is-absolute': 'npm:path-is-absolute@1.0.1',
                'slash': 'npm:slash@1.0.0',
                'babel-template': 'npm:babel-template@6.26.0',
                'babel-code-frame': 'npm:babel-code-frame@6.26.0',
                'babel-register': 'npm:babel-register@6.26.0',
                'babel-traverse': 'npm:babel-traverse@6.26.0',
                'lodash': 'npm:lodash@4.17.4',
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'source-map': 'npm:source-map@0.5.7',
                'babylon': 'npm:babylon@6.18.0',
                'convert-source-map': 'npm:convert-source-map@1.5.0',
                'minimatch': 'npm:minimatch@3.0.4',
                'debug': 'npm:debug@2.6.8'
            }
        },
        'npm:babel-generator@6.26.0': {
            'map': {
                'babel-types': 'npm:babel-types@6.26.0',
                'babel-messages': 'npm:babel-messages@6.23.0',
                'lodash': 'npm:lodash@4.17.4',
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'source-map': 'npm:source-map@0.5.7',
                'trim-right': 'npm:trim-right@1.0.1',
                'jsesc': 'npm:jsesc@1.3.0',
                'detect-indent': 'npm:detect-indent@4.0.0'
            }
        },
        'npm:babel-helpers@6.24.1': {
            'map': {
                'babel-template': 'npm:babel-template@6.26.0',
                'babel-runtime': 'npm:babel-runtime@6.26.0'
            }
        },
        'npm:babel-template@6.26.0': {
            'map': {
                'babel-traverse': 'npm:babel-traverse@6.26.0',
                'babel-types': 'npm:babel-types@6.26.0',
                'lodash': 'npm:lodash@4.17.4',
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'babylon': 'npm:babylon@6.18.0'
            }
        },
        'npm:babel-register@6.26.0': {
            'map': {
                'babel-core': 'npm:babel-core@6.26.0',
                'lodash': 'npm:lodash@4.17.4',
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'home-or-tmp': 'npm:home-or-tmp@2.0.0',
                'source-map-support': 'npm:source-map-support@0.4.16',
                'core-js': 'npm:core-js@2.5.0',
                'mkdirp': 'npm:mkdirp@0.5.1'
            }
        },
        'npm:babel-traverse@6.26.0': {
            'map': {
                'babel-types': 'npm:babel-types@6.26.0',
                'babel-code-frame': 'npm:babel-code-frame@6.26.0',
                'babel-messages': 'npm:babel-messages@6.23.0',
                'lodash': 'npm:lodash@4.17.4',
                'babel-runtime': 'npm:babel-runtime@6.26.0',
                'babylon': 'npm:babylon@6.18.0',
                'invariant': 'npm:invariant@2.2.2',
                'globals': 'npm:globals@9.18.0',
                'debug': 'npm:debug@2.6.8'
            }
        },
        'npm:babel-messages@6.23.0': {
            'map': {
                'babel-runtime': 'npm:babel-runtime@6.26.0'
            }
        },
        'npm:babel-code-frame@6.26.0': {
            'map': {
                'esutils': 'npm:esutils@2.0.2',
                'js-tokens': 'npm:js-tokens@3.0.2',
                'chalk': 'npm:chalk@1.1.3'
            }
        },
        'npm:minimatch@3.0.4': {
            'map': {
                'brace-expansion': 'npm:brace-expansion@1.1.8'
            }
        },
        'npm:source-map-support@0.4.16': {
            'map': {
                'source-map': 'npm:source-map@0.5.7'
            }
        },
        'npm:invariant@2.2.2': {
            'map': {
                'loose-envify': 'npm:loose-envify@1.3.1'
            }
        },
        'npm:home-or-tmp@2.0.0': {
            'map': {
                'os-tmpdir': 'npm:os-tmpdir@1.0.2',
                'os-homedir': 'npm:os-homedir@1.0.2'
            }
        },
        'npm:detect-indent@4.0.0': {
            'map': {
                'repeating': 'npm:repeating@2.0.1'
            }
        },
        'npm:brace-expansion@1.1.8': {
            'map': {
                'concat-map': 'npm:concat-map@0.0.1',
                'balanced-match': 'npm:balanced-match@1.0.0'
            }
        },
        'npm:chalk@1.1.3': {
            'map': {
                'escape-string-regexp': 'npm:escape-string-regexp@1.0.5',
                'strip-ansi': 'npm:strip-ansi@3.0.1',
                'supports-color': 'npm:supports-color@2.0.0',
                'ansi-styles': 'npm:ansi-styles@2.2.1',
                'has-ansi': 'npm:has-ansi@2.0.0'
            }
        },
        'npm:debug@2.6.8': {
            'map': {
                'ms': 'npm:ms@2.0.0'
            }
        },
        'npm:mkdirp@0.5.1': {
            'map': {
                'minimist': 'npm:minimist@0.0.8'
            }
        },
        'npm:repeating@2.0.1': {
            'map': {
                'is-finite': 'npm:is-finite@1.0.2'
            }
        },
        'npm:strip-ansi@3.0.1': {
            'map': {
                'ansi-regex': 'npm:ansi-regex@2.1.1'
            }
        },
        'npm:has-ansi@2.0.0': {
            'map': {
                'ansi-regex': 'npm:ansi-regex@2.1.1'
            }
        },
        'npm:is-finite@1.0.2': {
            'map': {
                'number-is-nan': 'npm:number-is-nan@1.0.1'
            }
        },
        'npm:acorn-jsx@4.0.1': {
            'map': {
                'acorn': 'npm:acorn@5.1.1'
            }
        }
    }
});
