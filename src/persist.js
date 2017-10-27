import assoc from './tools/assoc.js'

export function savePenToDisk(code, penId) {
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
                penId,
                { id: penId, ...code, modifiedDate: new Date().toISOString() },
                savedPens
            )
        )
    )
    localStorage.setItem('last_saved_pen', penId)
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
                new Date(a.modifiedDate).getTime() -
                new Date(b.modifiedDate).getTime()
            )
        })
}

export function getSavedPen(id) {
    let savedPens = getSavedPens()

    return savedPens[id]
}
