export default function assoc(prop, val, obj) {
    return Object.assign({}, obj, {
        [prop]: val
    })
}
