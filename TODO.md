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
- [x] Auto format for css code
- [x] fake props can be moved to frontend. Much more control.
- [x] Don't need the docgen stuff and meta file to be pretty formatted. Waste of bytes.
- [x] React fake props flowtype support
  - [x] simple types
  - [x] custom types - signature
  - [x] complex custom types - signature inside signature. E.g. type Person { repos: Array<Repo> }; type Repo = { url: string, commits: Array<Commit> }; type Commit = {...}`
- [x] React.PropTypes is not present in the version of react i use for rollick. Which breaks our components which import { PropTypes } from 'react'. One way is to add 'prop-types' dependency to our 
- [x] Have a way to load the font icons specific to the project
  - Fixed it by allowing a `paths` property in the config file. Works like the paths property in jspm and requirejs. Like aliases.
- [x] Fake data for many things are not good enough. E.g. arrayOf(shape), oneOf etc. Fix that first thing.
- [x] The attribute pane should take care of converting data to the type of the prop when something changes. Returning string in some case, boolean in another and function some time else confuses the hell out of the consumer of onChange
- [x] styleguide component. flip of a button on the header.
- [x] Make all dependencies as normal dependencies. In other words, move all dev dependencies to dependencies section in package.json
- [x] Put format button on each editors header 
 [x] Allow another layout where the editors are on the top
- [x] Error footer for each editor 
- [x] Fix highlight issues in editors
  - The highlight was not happening after i integrated emmet. Wasted so many hours trying to figure out the root cause. Was getting Codemirror instance from a different location (node_modules) to feed to emmet plugin and react-codemirror. And was calling the mode files from a different location (jspm_packages/npm/...). When i reconciled the locations, boom, it worked.
- [ ] Allow hiding of editor panels 
- [ ] load babel-standalone from jspm_packages or node_modules instead of unpkg. The tool should work offline.
- [ ] If the cursor is inside the definition of some component in the editor, show all possible props for the component somewhere along with the prop types. A detailspane for each component? Each prop can then be changed from the details pane too. Then we would need to maintain the jsx tree in data somehow. Too much for initial scope.
  - [ ] Need to maintain the tree for jsx code if we wnat to do anything intersting on the editor front
    - [ ] Need to maintain the tree for jsx code if we wnat to do anything intersting on the editor front.
- [ ] Ability to save prop values
- [ ] Save and share your design
- [ ] Have to think about bundling the app into a single file for production use.
  - Having a bundle for prod use will also allow easy use of hot-reloading in dev. 
  - [ ] Tried it and jspm throws a 'run out of heap memory' or something error. Followed a github issue on jspm repo and tried increasing nodejs heap size using - `node --max_old_space_size=4098 ./node_modules/.bin/jspm bundle main.js app-bundle.js --minify`, but that fails after a long time with the error `SyntaxError: Unexpected token: name (r)`. Also tried using `--skip-source-maps` but that didn't work either. The bundling however does with (albiet super slow) without the `--minify` option.
    - Further digging showed that it's a uglifyjs problem. Tried to create the bundle first and then use uglifyjs on the bundle. Looks like the bundle has es6 code (e.g. let, const) and uglifyjs does not understand es6 completely.
    - One idea can be to use another minifier. E.g. babel-minify
  - [ ] Can just create a separate `index-dev.html` file which will have the contents of existing `index.html` file and the `index.html` file can point to the bundled file.
  - [ ] Can't import the components meta file using import statement if we create a bundle. That bundle will never access the project specific meta file. Three solutions. 1. Load the meta file dynamically in a react lifestyle method. 2. Generate meta file in the front-end for each component. 3. For each component, load the meta file. Which means, generating one meta file for each component and saving it in the same folder as the js file.

  - [ ] Once the bundled file is there, we can remove these steps from the install script -
      1. Copy src folder
      2. `npm install`
      3. `jspm install`
      4. Loss. It's all profit now.
- [ ] When search bar is in focus, cannot focus the jsx editor by clicking on it. It works if i first click the css editor (which get's the focus) and then click the jsx editor
- [ ] After prettier formatting, the cursor offset is not correct. It doesn't work at all in some cases, which is ok. But when it's working, it calculates wrong offset.
- [ ] Improve the editor experience. Cmd+/ should comment the current line. More shortcuts should work.
- [ ] Add option to specify docgen options in rollick config file. Example exclude list for folders/files.
- [ ] Add option to specify fakeData options in rollick config. Example - `optional: boolean` to generate data for optional types or not.
- [ ] Looks like react-docgen does not understand flow exact types ({| <definitions> |}). Can use the beta version if feeling adventorous - https://github.com/reactjs/react-docgen/issues/173
- [ ] Have multiple commands to run at top level - `rollick install`, `rollick start`, `rollick generate-meta`, `rollick watch`. Use `args` npm module to generate help documentation for each.
  - [ ] Rename install.js file to index.js and then use `args` module to delegate to `install` or `start` functions internally.
  - [ ] `rollick start` will start the server to serve the files
  - [ ] `rollick generate-meta` to regenerate meta files wheneven needed (after change in component definition)
  - [ ] `rollick watch` to watch all component files and automatically regenrate meta file on change of any component file
- [ ] Integrate with PP components
  - [x] The font icons loaded when the class is activated goes directly to server. Need to rewrite path for those (from /harmony/fonts to /frontend/web/wwwroot/harmony/fonts)
  - [x] less file paths from pp/core/less folder. Imported as '~pp-common-<someting>' in many less files
    - fixed it by writing custom server to serve js files. Passing all js files through babel and converting to commonjs file before being served to the browser. Not at all efficient but does the trick.
  package.json and use codemod to do the necessary changes
    - fixed it by writing custom server to serve js files. Passing all js files through babel and converting to commonjs file before being served to the browser. Not at all efficient but does the trick.
  - [x] CSS still half breaks in a weird way. Probably connected to some other global css file.
    - Looks like it breaks in weird ways all over the place, even in our system
  - [ ] Need to manually add proptypes for components which are missing proptypes. Also need to modify proptypes for components which do not specify the isRequired flag correctly.
- [x] own server to serve files
  - [x] Introduce concept of loaders through rollick.config file. E.g. using tildeLoader for less files in projectplace project
  - [x] Use babel transpilation by default. Would take care of edge cases with named imports for ES6 modules which may/maynot work with systemjs 
  currently
    - [ ] rollick config should give an option to set custom babel presets and plugins
    - [ ] add default presets and plugins used in babel in the server to npm dependencies list
- [ ] Script which allows you to use rollick with your own project. Steps for the script should be - 
      - [x] Copy needed stuff to .rollick folder inside that project
      - [x] read rollick.config.js file in the root of the project
      - [x] mainly pickup the component folder path from the config
      - [x] generate the components meta file from the component path and store it inside .rollick folder
      - [ ] start server in project root
- [ ] Provide a utility in the UI to easily fill in fake data for common cases like ‘email’, ‘url’, ‘photo url’, ‘name’, ‘age’, ‘sex’, ‘description’, ‘long description’ etc.
- [ ] host app on now.sh
  - [ ] Tried and failed. Somehow fails while installing bluebird.
    - Looks like a memory issue. Current dependency tree is huge.
- [ ] Export to react component feature
- [ ] vim mode for editor?
- [ ] Production build setup. Should generate a minified bundle and point to react production file 
- [ ] Error handling in editors and global errors 
  - [x] Error handling in editors
  - [ ] Global errors
- [ ] Check for rollick config file on install command and throw error if absent
- [ ] Undo/redo feature 
- [ ] Peerdependencies
- [ ] Look at create react app and see what happens when we invoke create-react-app on the command line. Should have similar 'rollick install' or something 
- [ ] The name rollick restricts future development scope to react users. Which should not be the case. Any component based architecture should be OK. Change the name. Jalebi? Nageen? Gambol? Jambol? Shenanigan? Kodai?
- [ ] Preview panel styling 
- [ ] Don't need to copy meta data generator. In fact, should run it from project root and just copy the output files to .kodai folder 
  - [ ] More difficult to do than it looks like. Because of the way that script is setup
- [ ] react-docgen fails sometimes when it find emacs temp files in the directory and our script doesn’t show any error.
- [ ] Clean up dependencies
- [ ] Performance optimisations
- [ ] Generate fake data only for required props. There's too much noise because of all the props being there in the editor. Most are not required for the component to function.
- [ ] If cursor is in between another element, the search result goes into a place which is not valid jsx. But it's hard to see in the editor what went wrong where. One solution is to first try to prettier format the resulting jsx. If there's an error, instead put the searched component at the end of the jsx stuff in the browser. User can then rearrange the jsx as needed. At least the jsx will be correct and user sees the added component 
- [ ] Save and share the pen 
- [ ] What happens if users copy/paste some existing jsx consisting of components?
- [ ] Check why docgen fails for many of our components 
  - [ ] One of the reasons is when there is a temp emacs file, which is actually a soft link. Starts with .#
- [ ] Create new npm packages, docgentofake, which takes description for one component produced by docgen and returns fake data for that
- [ ] Provide a UI to fix the config file

### Bugs
-----
- [x] Fix name generator from component path with index.js as the final file
- [ ] if the iframe (right pane) is in focus, keyboard events don't propagate to parent. So keybaord shortcuts don't work
- [ ] clicking outside of search box should close it

## Ambititious

- [ ] since we already know how to show list of all components and load them when required with fake data, we can very easily generate a styleguide out of it. So the tool can morph between styleguide and reactor with almost zero cost! And since we have all the logic already for generating formatted jsx code for components, the preview pane for styleguide can have a text area inside where users can play with the props, just like styleguide by react velocity people.
- [ ] When showing the styleguide, user will have an option to open that component in rollick! Or a button which says "user this" or "copy code"
