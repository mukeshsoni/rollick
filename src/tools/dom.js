/**
 * scrolls a list of items in a container, so that the provided element is in view
 * @param {container DOM element reference} container
 * @param {DOM element which should be visible} element
 * @param {Should the DOM element be put in the middle of the container view} middle
 */
export function scrollTo(container, element, middle = false) {
    console.log('scrollTo 1')
    if (!element || !container) {
        return
    }
    console.log('scrollTo 2')

    var containerHeight = container.offsetHeight
    var containerOffset = container.getBoundingClientRect()
    var containerTop = containerOffset.top + document.body.scrollTop
    var containerBottom = containerTop + containerHeight

    var elementOffset = element.getBoundingClientRect()

    var elementHeight = element.offsetHeight
    var elementTop = elementOffset.top + document.body.scrollTop
    var elementBottom = elementTop + elementHeight
    var newScrollTop = elementTop - containerTop + container.scrollTop
    var middleOffset = containerHeight / 2 - elementHeight / 2

    if (elementTop < containerTop) {
        // scroll up
        if (middle) {
            newScrollTop -= middleOffset
        }
        container.scrollTop = newScrollTop
    } else if (elementBottom > containerBottom) {
        // scroll down
        if (middle) {
            newScrollTop += middleOffset
        }
        var heightDifference = containerHeight - elementHeight
        container.scrollTop = newScrollTop - heightDifference
    }
}
