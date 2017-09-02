### Wishlist
---
- [x] Render components in iframe for isolation of css/javascript scope. Problem with getting iframe to work is that the styles for a component are added by creating link tags in the head. They are not available in the iframe. One way can be to intercept network requests, filter css ones and add those link tags in iframe head. Can use service worker for that.
- [x] editor theme - dark (night or ‘solarized dark’
- [x] height of the editors
- [x] add splitpane for left and right pane
- [x] Emmet support for editors
- [ ] Provide a utility in the UI to easily fill in fake data for common cases like ‘email’, ‘url’, ‘photo url’, ‘name’, ‘age’, ‘sex’, ‘description’, ‘long description’ etc.
- [x] Let 'command+i' work, even if the cursor is not in jsx editor
  - [x] show helpful suggestion for 'command+i' shortcut for searching components
- [ ] host app on now.sh
  - [ ] Tried and failed. Somehow fails while installing bluebird.
- [ ] send pull request to react-fake-props
- [ ] export to react component feature
- [ ] preview in search results of components
- [ ] vim mode for editor?
- [ ] load babel-standalone from jspm_packages or node_modules instead of unpkg. The tool should work offline.

### Bugs
-----
- [ ] if the iframe (right pane) is in focus, keyboard events don't propagate to parent. So keybaord shortcuts don't work
