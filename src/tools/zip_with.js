export default function zipWith(zipper, la, lb) {
    if (la.length < lb.length) {
        return la.map((laItem, index) => {
            return zipper(laItem, lb[index])
        })
    } else {
        return lb.map((lbItem, index) => {
            return zipper(lbItem, la[index])
        })
    }
}
