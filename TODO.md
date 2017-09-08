### Wishlist
---
- [x] Render components in iframe for isolation of css/javascript scope. Problem with getting iframe to work is that the styles for a component are added by creating link tags in the head. They are not available in the iframe. One way can be to intercept network requests, filter css ones and add those link tags in iframe head. Can use service worker for that.
- [x] editor theme - dark (night or ‘solarized dark’
- [x] height of the editors
- [x] add splitpane for left and right pane
- [x] Emmet support for editors
- [x] Let 'command+i' work, even if the cursor is not in jsx editor
  - [x] show helpful suggestion for 'command+i' shortcut for searching components
- [x] Now there are two search places. One is the modal and another in the header. What if we wanted only one interface, the one in the header. Pressing command+i should then focus the input box in the search component in the header. How to set the focus declaratively based on the state (showSearchModal) of the parent? One way is to show dummy search input component and then swap to SearchBox when `showSearchModal={true}`. That didn't work though because i refactored the search input into it's own component and wanted to use it for the dummy search input box. Now the ref on the input box is not available to SearchBox component. So it can't focus it on componentDidMount. Question is - How to get ref handle from child to parent? One solution i found was to use cloneElement and then attach ref - https://github.com/facebook/react/issues/8873#issuecomment-275423780. Sadly that didn't work for me. The `node` returned in ref callback was null. I might be doing something wrong there.
        Fixed it by making the `SearchInput` component a class and not a function. That way, i can attach a ref to that component and get other stuff out of it.
- [x] preview in search results of components
- [x] send pull request to react-fake-props
- [ ] fake props can be moved to frontend. Much more control.
- [ ] React fake props flowtype support
- [ ] Auto format for css code
- [ ] Improve the editor experience. Cmd+/ should comment the current line. The jsx editor has no colors. More shortcuts should work.
- [ ] Integrate with PP components
  - [ ] less file paths from pp/core/less folder. Imported as '~pp-common-<someting>' in many less files
  - [ ] React.PropTypes is not present in the version of react i use for reactpen. Which breaks our components which import { PropTypes } from 'react'. One way is to add 'prop-types' dependency to our package.json and use codemod to do the necessary changes
  - [ ] CSS still half breaks in a weird way. Probably connected to some other global css file.
- [ ] own server to serve files
  - [ ] Introduce concept of loaders through reactpen.config file. E.g. using tildeLoader for less files in projectplace project
  - [ ] Use babel transpilation by default. Would take care of edge cases with named imports for ES6 modules which may/maynot work with systemjs 
  currently
    - [ ] reactpen config should give an option to set custom babel presets and plugins
    - [ ] add default presets and plugins used in babel in the server to npm dependencies list
- [ ] Script which allows you to use reactpen with your own project. Steps for the script should be - 
      - [x] Copy needed stuff to .reactpen folder inside that project
      - [x] read reactpen.config.js file in the root of the project
      - [x] mainly pickup the component folder path from the config
      - [x] generate the components meta file from the component path and store it inside .reactpen folder
      - [ ] start server in project root
- [ ] Provide a utility in the UI to easily fill in fake data for common cases like ‘email’, ‘url’, ‘photo url’, ‘name’, ‘age’, ‘sex’, ‘description’, ‘long description’ etc.
- [ ] host app on now.sh
  - [ ] Tried and failed. Somehow fails while installing bluebird.
- [ ] export to react component feature
- [ ] vim mode for editor?
- [ ] load babel-standalone from jspm_packages or node_modules instead of unpkg. The tool should work offline.
- [ ] Production build setup. Should generate a minified bundle and point to react production file 
- [ ] Error handling in editors and global errors 
- [ ] Check for reactpen config file on install command and throw error if absent
- [ ] Undo/redo feature 
- [ ] Peerdependencies
- [ ] Look at create react app and see what happens when we invoke create-react-app on the command line. Should have similar 'reactpen install' or something 
- [ ] The name reactpen restricts future development scope to react users. Which should not be the case. Any component based architecture should be OK. Change the name. Jalebi? Nageen? Gambol? Jambol? Shenanigan? Kodai?
- [ ] Preview panel styling 
- [ ] Make all dependencies as normal dependencies. In other words, move all dev dependencies to dependencies section in package.json
- [ ] Don't need to copy meta data generator. In fact, should run it from project root and just copy the output files to .kodai folder 
  - [ ] More difficult to do than it looks like. Because of the way that script is setup
- [ ] react-docgen fails sometimes when it find emacs temp files in the directory and our script doesn’t show any error.

### Bugs
-----
- [x] Fix name generator from component path with index.js as the final file
- [ ] if the iframe (right pane) is in focus, keyboard events don't propagate to parent. So keybaord shortcuts don't work
- [ ] clicking outside of search box should close it

## Ambititious

- [ ] since we already know how to show list of all components and load them when required with fake data, we can very easily generate a styleguide out of it. So the tool can morph between styleguide and reactor with almost zero cost! And since we have all the logic already for generating formatted jsx code for components, the preview pane for styleguide can have a text area inside where users can play with the props, just like styleguide by react velocity people.
- [ ] When showing the styleguide, user will have an option to open that component in reactpen! Or a button which says "user this" or "copy code"
