import {
    getPropValue,
    populateDefaultValues
} from '../../component_maker_helpers/prop_value_from_string.js'
import faker from '../../faker.js'

export function getFakeProps(component) {
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
