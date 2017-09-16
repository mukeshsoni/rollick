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
    return sum(positions) + positions[0]
}

// returns filtered list from the given list based on the searchText. The filtered list allows for characters in searchText to appear in a non consecutive way in the strings. E.g. searching for searchText 'chck' will return 'checkbox'
export default function looseFilter(list, key, searchText) {
    // return everything if the search text is empty
    if (searchText.trim() === '') {
        return list
    }

    const filteredList = list
        .map(item => {
            return Object.assign({}, item, {
                positions: searchText
                    .toLowerCase()
                    .split('')
                    .reduce((acc, searchChar, index, arr) => {
                        const str = item[key].toLowerCase()
                        return acc.concat(
                            str
                                .slice(
                                    // since acc will have array of indices for search characters starting from the next index onwards, i.e. for 'chk' and 'checkbox', search for 'h' will be done in 'heckbox'. Hence the second index in acc will also be 0. So we need to offset that by taking the sum of all indices and adding the total length of the accumulator too. Will fail when there's a negative index in between. Hmm.
                                    acc.length > 0 ? sum(acc) + acc.length : 0
                                )
                                .indexOf(searchChar)
                        )
                    }, [])
                // correct the positions. With above calculation, finding 'chk' in 'check' would return [0, 0, 2]. we need [0, 1, 4]
                // or maybe [0, 0, 2] is enough to calculate the rank. In fact. it makes it easier
            })
        })
        .filter(item => item.positions.length === searchText.length)
        // with above calculation, all positions arrays will be same length. But some will have negative numbers. When a character in the searchText is not found in the string. We will discard those items
        .filter(item => item.positions.every(pos => pos >= 0))
        .map(item => ({ ...item, rank: rank(item.positions) }))
        // putting a restriction on rank will definitely make search results better. But because of the way the rank function is defined right now, it might hide some possitive ones.
        .filter(item => item.rank < 25)
        .sort((a, b) => a.rank - b.rank)

    return filteredList
}
