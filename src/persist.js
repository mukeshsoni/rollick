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

export function saveProps(componentPath, props) {
    let componentMeta = {}

    try {
        componentMeta = JSON.parse(localStorage.getItem(componentPath))
    } catch (e) {
        console.error('Error load', e)
    }

    localStorage.setItem(
        componentPath,
        JSON.stringify({
            ...componentMeta,
            props
        })
    )
}

export function getSavedProps(componentPath) {
    let componentMeta = {}
    try {
        componentMeta = JSON.parse(localStorage.getItem(componentPath))
    } catch (e) {
        console.error(
            'Error loading saved component props. Probably never saved',
            componentPath
        )
    } finally {
        return (componentMeta && componentMeta.props) || {}
    }
}
