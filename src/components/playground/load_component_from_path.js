import {
    populateDefaultValues
} from '../../component_maker_helpers/prop_value_from_string.js'
import faker from '../../faker.js'

function getFakeProps(component) {
    let fakeProps

    if (component.fakeProps) {
        fakeProps = component.fakeProps
    } else {
        fakeProps = populateDefaultValues(
            component.props,
            faker(component.props, { optional: false })
        )
    }
}

export default function loadComponentFromPath(selectedItem) {
    return SystemJS.import(selectedItem.path)
        .then(com => {
            // TODO - this is not acceptable. It's a ticking time bomb, attaching stuff to window
            const fakeProps = getFakeProps(selectedItem)

            return {
                component: com,
                fakeProps
            }
        })
}
