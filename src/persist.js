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
        JSON.stringify(assoc(penId, code, savedPens))
    )
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

export function getSavedPen(id) {
    let savedPens = getSavedPens()

    return savedPens[id]
}
