import { transpile } from './transpile_helpers.js'
import belt from '../../belt.js'
const { isCapitalized, any } = belt

export function loadComponentsInJsx(jsxCode) {
    const js = transpile(`<div>${jsxCode}</div>`)

    if (!js.error) {
        return SystemJS.import('components.meta.json!json').then(
            componentsMetaList => {
                const customComponentTokens = js.ast.tokens.filter(token => {
                    return (
                        token.type.label === 'jsxName' &&
                        isCapitalized(token.value)
                    )
                })

                const componentsToLoad = componentsMetaList.filter(comMeta => {
                    return any(
                        token => token.value === comMeta.name,
                        customComponentTokens
                    )
                })

                const loadPromises = componentsToLoad.map(comMeta => {
                    return SystemJS.import(comMeta.path).then(com => {
                        window[comMeta.name] = com.default || com
                        return com.default || com
                    })
                })

                return Promise.all(loadPromises)
            }
        )
    } else {
        return Promise.reject({ error: js.error })
    }
}
