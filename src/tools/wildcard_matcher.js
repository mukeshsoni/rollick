// for allowing wirdcards like '*.less' to test for all files with .less extension
export default function wildCardMatcher(rule, text) {
    const regex = new RegExp(
        rule.split('*').map(a => a.replace('.', '\\.'))
    ).join('.*')

    return regex.test(text)
}
