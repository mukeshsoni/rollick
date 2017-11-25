import assoc from './tools/assoc.js'

// TODO - what if the save failed? How will the called of this function know that?
// Maybe return the saved object on successful save and return error otherwise
// This function can return a Maybe or Either
export function savePenToDisk(code, id, name) {
    let savedPens = {}

    try {
        savedPens = JSON.parse(localStorage.getItem('saved_pens'))
    } catch (e) {
        console.error('Error loading saved pens', e)
    }

    localStorage.setItem(
        'saved_pens',
        JSON.stringify(
            assoc(
                id,
                { id, name, ...code, modifiedDate: new Date().toISOString() },
                savedPens
            )
        )
    )
    localStorage.setItem('last_saved_pen', id)
}

export function updatePenName(id, name) {
    let savedPen = getSavedPen(id)

    localStorage.setItem(
        'saved_pens',
        JSON.stringify(assoc(id, { ...savedPen, name }, getSavedPens()))
    )
}

export function lastSavedPen() {
    if (localStorage.getItem('last_saved_pen')) {
        return getSavedPen(localStorage.getItem('last_saved_pen'))
    } else {
        return {}
    }
}

export function getSavedPens() {
    let savedPens = {}
    try {
        savedPens = JSON.parse(localStorage.getItem('saved_pens'))
    } catch (e) {
        console.error('error loading saved pens')
    } finally {
        return savedPens
    }
}

export function getSavedPensSorted() {
    let savedPens = getSavedPens()

    return Object.keys(savedPens)
        .map(id => {
            return {
                id,
                ...savedPens[id]
            }
        })
        .sort((a, b) => {
            return (
                new Date(b.modifiedDate).getTime() -
                new Date(a.modifiedDate).getTime()
            )
        })
}

export function getSavedPen(id) {
    let savedPens = getSavedPens()

    return savedPens[id]
}

export function saveComponentData(dataName, componentPath, data) {
    let componentData = {}

    try {
        componentData = JSON.parse(localStorage.getItem('component_data')) || {}
    } catch (e) {
        console.error('Error loading component data', e)
    }

    localStorage.setItem(
        'component_data',
        JSON.stringify(
            assoc(
                componentPath,
                { ...componentData[componentPath], [dataName]: data },
                componentData
            )
        )
    )
}

export function getSavedComponentData(dataName, defaultValue, componentPath) {
    let componentData = {}
    try {
        componentData = JSON.parse(localStorage.getItem('component_data'))
    } catch (e) {
        console.error(
            'Error loading saved component data. Probably never saved',
            componentPath,
            e
        )
    } finally {
        return (
            (componentData &&
                componentData[componentPath] &&
                componentData[componentPath][dataName]) ||
            defaultValue
        )
    }
}

export const saveProps = saveComponentData.bind(null, 'props')
export const getSavedProps = getSavedComponentData.bind(null, 'props', {})
export const saveJsx = saveComponentData.bind(null, 'jsxCode')
export const getSavedJsx = getSavedComponentData.bind(null, 'jsxCode', '')

export function getAllSavedComponentsData() {
    try {
        let componentData = JSON.parse(localStorage.getItem('component_data'))
        return componentData
    } catch (e) {
        console.error(
            'Error loading saved component data. Probably never saved'
        )
        return {}
    }
}

export function saveAllComponentsData(data) {
    try {
        localStorage.setItem('component_data', JSON.stringify(data))
    } catch (e) {
        console.error('Error saving component data', e)
    }
}
