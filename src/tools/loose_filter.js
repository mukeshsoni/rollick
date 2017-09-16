import first from './first.js'
import init from './init.js'
import rest from './rest.js'
import sum from './sum.js'
import zipWith from './zip_with.js'

// TODO - come up with a better rank function
// P. S. - a lower rank means a better match
// Rignt now the rank is just the sum of difference of positions of each character of the search text inside the string
// Plus the position of the first character in the searchText in the string. We want to rank strings where the substring starts early before those where the search text start later in the string. E.g. or 'com', prefer 'Component' (rank - 0) over 'nincompoop' (rank 3)
function rank(positions) {
    return (
        sum(zipWith((a, b) => b - a - 1, init(positions), rest(positions))) +
        first(positions)
    )
}

// returns filtered list from the given list based on the searchText. The filtered list allows for characters in searchText to appear in a non consecutive way in the strings. E.g. searching for searchText 'chck' will return 'checkbox'
export default function looseFilter(list, key, searchText) {
    // return everything if the search text is empty
    if (searchText.trim() === '') {
        return list
    }

    const charPositions = list
        .map(item => {
            return Object.assign({}, item, {
                positions: searchText
                    .split('')
                    .reduce((acc, searchChar, index, arr) => {
                        const str = item[key].toLowerCase()
                        if (index > 0) {
                            // only search from whereever the last character was found. E.g. if we want to find "ce" inside "abcdefg", the first run find 'c' at [2] and the next run only searches for 'e' in "defg"
                            if (
                                str
                                    .slice(acc[index - 1] + 1)
                                    .indexOf(searchChar.toLowerCase()) >= 0
                            ) {
                                return acc.concat(
                                    str
                                        .slice(acc[index - 1] + 1)
                                        .indexOf(searchChar) +
                                        acc[index - 1] +
                                        1
                                )
                            } else {
                                return acc
                            }
                        } else {
                            return str.indexOf(searchChar.toLowerCase()) >= 0
                                ? acc.concat(
                                      str.indexOf(searchChar.toLowerCase())
                                  )
                                : acc
                        }
                    }, [])
            })
            // filter if all characters in substring are not present in any string
        })
        .filter(item => item.positions.length === searchText.length)
        .map(item => ({ ...item, rank: rank(item.positions) }))
        // putting a restriction on rank will definitely make search results better. But because of the way the rank function is defined right now, it might hide some possitive ones.
        .filter(item => item.rank < 25)
        .sort((a, b) => a.rank - b.rank)

    return charPositions
}
