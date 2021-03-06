<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#org06d0729">1. P1 <code>[44/93]</code></a></li>
<li><a href="#bugs">2. Bugs <code>[5/7]</code></a></li>
<li><a href="#server">3. Rollick server - own server to serve files <code>[1/2]</code></a></li>
<li><a href="#projectplace">4. Integrate with PP components <code>[3/4]</code></a>
<ul>
<li><a href="#ambititious">4.1. Ambititious <code>[2/2]</code></a></li>
</ul>
</li>
</ul>
</div>
</div>

<a id="org06d0729"></a>

# P1 <code>[44/93]</code>

-   [ ] Having a database for rollick makes a lot of sense. Can store all kinds of data there.

Sharing through url? Store the code in database against the unique url.
Saving configuration for the tool? Store in the database.
Storing particular values for props and state? Store in the database.
Enhancing documentation of components through a rich text editor or however way? Store it in the database.

-   [ ] Start using these concepts/technologies going forward
    -   [ ] Use of Either/Maybe/Functors/Applicatives. Should make life easier
        while dealing with exception (which is a lot in this tool)
    -   [ ] Write parts of the system in purescript
-   [ ] <code>[0/1]</code> If the cursor is inside the definition of some component in the
    editor, show all possible props for the component somewhere along
    with the prop types. A detailspane for each component? Each prop can
    then be changed from the details pane too. Then we would need to
    maintain the jsx tree in data somehow. Too much for initial scope.
    -   [ ] Need to maintain the tree for jsx code if we wnat to do
        anything intersting on the editor front.
        Don't need to. We use babel.parse, which gives the ast for the
        code
-   [ ] Ability to save prop values
    -   [ ] Think about the best place to save those values.

One way can be to maintain a .rollick or .meta file for each component.

-   [ ] Look at the todo item for having a database for rollick

-   [ ] Option to mark a component as ‘filtered’ in the style guide.

The search list will then filter those components.
There would be an option to ‘Show all components’ and then toggle the filter option back.
Why is it needed? The automatic sweep of the components folder also finds many components which are not necessarily part of the UI kit.
We don’t want them to clutter the list. They also cause confusion because they might have names similar to some proper component.

-   [ ] Show a `How to use` section in the styleguide preview section. Like victory.js does.

Users will be also then able to modify the prop values from the jsx usage section.

-   [ ] Save in local. Allow create new pen. Show list of saved pens and
    allow loading any of the saved ones.
-   [ ] Add "save", "create new" and "open" feature. Both will work using
    local storage for now. Save will also add a query Param to the URL
    -   [ ] Save
    -   [ ] Create New
    -   [ ] Open
-   [ ] Render components in iframe for isolation of css/javascript
    scope. Problem with getting iframe to work is that the styles for a
    component are added by creating link tags in the head. They are not
    available in the iframe. One way can be to intercept network
    requests, filter css ones and add those link tags in iframe head. Can
    use service worker for that.
    -   [ ] See how we can inject the css required in a component into the iframe
        -   [ ] The iframe is a problem because while loading a component the css required by that file is inlined.

But that need not be. Systemjs css plugin had an option whereby the css can be loaded as a separate file.
<https://github.com/systemjs/plugin-css/blob/master/README.md>

-   [ ] Checkout react-storybook code. They also render the stories inside an iframe

-   [ ] Preview panel styling
-   [ ] Don't need to copy meta data generator. In fact, should run it
    from project root and just copy the output files to .kodai folder
    -   [ ] More difficult to do than it looks like. Because of the way that
        script is setup
-   [ ] Clean up dependencies
-   [ ] Performance optimisations
-   [ ] Check why docgen fails for many of our components
    -   [ ] One of the reasons is when there is a temp emacs file, which is
        actually a soft link. Starts with .#
-   [ ] Create new npm packages, docgentofake, which takes description
    for one component produced by docgen and returns fake data for that
-   [ ] Provide a UI to fix the config file
-   [ ] The js panel can be reserved for creating a new react component
    of your own and use it in the jex-editor. The problem then would be -
    we would lose the ability to link components inside jsx editor.
    People would start writing the whole thing they wanted to do in jsx
    editor, in the js editor. But what if jsx-editor and js-editor are
    both there, catering to 2 types of audiences? One is javascript and
    react savvy (js-editor then works like a normal editor) and another
    is designers, who use the jsx-editor with less js power but more
    affordance in terms of UX, like attributes pane to change jsx element
    properties.
-   [ ] Try out new way of resolving node<sub>modules</sub> files of the project.
    The paths way of specifying an alias for each and every node module
    does not scale. Breaks for one reason or another in one module or
    another. For dnd-core, it became a nightmare and non solvable at all
-   [ ] Provide a utility in the UI to easily fill in fake data for
    common cases like ‘email', ‘url', ‘photo url', ‘name', ‘age', ‘sex',
    ‘description', ‘long description' etc.
-   [ ] host app on now.sh
    -   [ ] Tried and failed. Somehow fails while installing bluebird.
        -   Looks like a memory issue. Current dependency tree is huge.
-   [ ] Export to react component feature
-   [ ] vim mode for editor?
-   [ ] Error handling in editors and global errors
-   [ ] Global errors
-   [ ] Check for rollick config file on install command and throw error
    if absent
-   [ ] Undo/redo feature
-   [ ] Peerdependencies
-   [ ] Look at create react app and see what happens when we invoke
    create-react-app on the command line. Should have similar 'rollick
    install' or something
-   [ ] Save and share your design. Should create a unique url which can be loaded anywhere.
-   [ ] Hot reloading. At least for development.
-   [ ] Component state is not maintained on code change triggering a
    repaint
-   [ ] Allow hiding of editor panels
-   [ ] Have to think about bundling the app into a single file for
    production use.
    
    -   Having a bundle for prod use will also allow easy use of
    
    hot-reloading in dev.
    
    -   [ ] Tried it and jspm throws a 'run out of heap memory' or something
    
    error. Followed a github issue on jspm repo and tried increasing
    nodejs heap size using -
      `node --max_old_space_size=4098 ./node_modules/.bin/jspm bundle main.js app-bundle.js --minify`,
      but that fails after a long time with the error
      `SyntaxError: Unexpected token: name (r)`. Also tried using
      `--skip-source-maps` but that didn't work either. The bundling
      however does with (albiet super slow) without the `--minify` option.
    
    -   Further digging showed that it's a uglifyjs problem. Tried to
        create the bundle first and then use uglifyjs on the bundle. Looks
        like the bundle has es6 code (e.g. let, const) and uglifyjs does
        not understand es6 completely.
    -   One idea can be to use another minifier. E.g. babel-minify

-   [ ] Can just create a separate `index-dev.html` file which will have
    the contents of existing `index.html` file and the `index.html` file
    can point to the bundled file.
-   [ ] Can't import the components meta file using import statement if
    we create a bundle. That bundle will never access the project
    specific meta file. Three solutions. 1. Load the meta file
    dynamically in a react lifestyle method. 2. Generate meta file in the
    front-end for each component. 3. For each component, load the meta
    file. Which means, generating one meta file for each component and
    saving it in the same folder as the js file.

-   [ ] Once the bundled file is there, we can remove these steps from
    the install script -
    1.  Copy src folder
    2.  `npm install`
    3.  `jspm install`
    4.  Loss. It's all profit now.

-   [ ] After prettier formatting, the cursor offset is not correct. It
    doesn't work at all in some cases, which is ok. But when it's
    working, it calculates wrong offset.
-   [ ] Improve the editor experience. Cmd+/ should comment the current
    line. More shortcuts should work.
-   [ ] Add option to specify docgen options in rollick config file.
    Example exclude list for folders/files.
-   [ ] Add option to specify fakeData options in rollick config. Example
    -   `optional: boolean` to generate data for optional types or not.
-   [ ] Looks like react-docgen does not understand flow exact types ({|
    <definitions> |}). Can use the beta version if feeling
    adventorous - <https://github.com/reactjs/react-docgen/issues/173>
-   [ ] Have multiple commands to run at top level - `rollick install`,
    `rollick start`, `rollick generate-meta`, `rollick watch`. Use `args`
    npm module to generate help documentation for each.
-   [ ] Rename install.js file to index.js and then use `args` module to
    delegate to `install` or `start` functions internally.
-   [ ] `rollick start` will start the server to serve the files
-   [ ] `rollick generate-meta` to regenerate meta files wheneven needed
    (after change in component definition)
-   [ ] `rollick watch` to watch all component files and automatically
    regenrate meta file on change of any component file
-   [X] editor theme - dark (night or ‘solarized dark'
-   [X] height of the editors
-   [X] add splitpane for left and right pane
-   [X] Emmet support for editors
-   [X] Let 'command+i' work, even if the cursor is not in jsx editor
-   [X] show helpful suggestion for 'command+i' shortcut for searching
    components
-   [X] Now there are two search places. One is the modal and another in
    the header. What if we wanted only one interface, the one in the
    header. Pressing command+i should then focus the input box in the
    search component in the header. How to set the focus declaratively
    based on the state (showSearchModal) of the parent? One way is to
    show dummy search input component and then swap to SearchBox when
    `showSearchModal={true}`. That didn't work though because i
    refactored the search input into it's own component and wanted to use
    it for the dummy search input box. Now the ref on the input box is
    not available to SearchBox component. So it can't focus it on
    componentDidMount. Question is - How to get ref handle from child to
    parent? One solution i found was to use cloneElement and then attach
    ref -
    <https://github.com/facebook/react/issues/8873#issuecomment-275423780>.
    Sadly that didn't work for me. The `node` returned in ref callback
    was null. I might be doing something wrong there. Fixed it by making
    the `SearchInput` component a class and not a function. That way, i
    can attach a ref to that component and get other stuff out of it.
-   [X] preview in search results of components
-   [X] send pull request to react-fake-props
-   [X] Auto format for css code
-   [X] fake props can be moved to frontend. Much more control.
-   [X] Don't need the docgen stuff and meta file to be pretty formatted.
    Waste of bytes.
-   [X] React fake props flowtype support
-   [X] simple types
-   [X] custom types - signature
-   [X] complex custom types - signature inside signature. E.g. type
    Person { repos: Array<Repo> }; type Repo = { url: string,
    commits: Array<Commit> }; type Commit = {&#x2026;}\`
-   [X] React.PropTypes is not present in the version of react i use for
    rollick. Which breaks our components which import { PropTypes } from
    'react'. One way is to add 'prop-types' dependency to our
-   [X] Have a way to load the font icons specific to the project
-   Fixed it by allowing a `paths` property in the config file. Works
    like the paths property in jspm and requirejs. Like aliases.
-   [X] Fake data for many things are not good enough. E.g.
    arrayOf(shape), oneOf etc. Fix that first thing.
-   [X] The attribute pane should take care of converting data to the
    type of the prop when something changes. Returning string in some
    case, boolean in another and function some time else confuses the
    hell out of the consumer of onChange
-   [X] styleguide component. flip of a button on the header.
-   [X] Make all dependencies as normal dependencies. In other words,
    move all dev dependencies to dependencies section in package.json
-   [X] Put format button on each editors header
-   [X] Allow another layout where the editors are on the top
-   [X] Error footer for each editor
-   [X] Fix highlight issues in editors
    The highlight was not happening after i integrated emmet. Wasted so
    many hours trying to figure out the root cause. Was getting
    Codemirror instance from a different location (node\\<sub>modules</sub>) to feed
    to emmet plugin and react-codemirror. And was calling the mode files
    from a different location (jspm\\<sub>packages</sub>/npm/&#x2026;). When i reconciled
    the locations, boom, it worked.
-   [X] load babel-standalone from jspm\\<sub>packages</sub> or node\\<sub>modules</sub>
    instead of unpkg. The tool should work offline.
-   [X] change editor mode for JS panel to 'jsx'. 'jsx' seems to handle
    both javascript and jsx
-   [X] Pass the code from js editor through babel transpilation in case
    user uses some jsx or other fancy ES6 features there
-   [X] Use local storage to save the code, so that it's loaded on next
    visit
-   [X] When loading code from local storage, automatically load the
    components in the jsx editor
-   [X] Add a question mark in front of every prop in attribute pane.
    Will show the prop schema generated by react docgen
-   [X] Error footer for each editor
-   [X] Put format button on each editors header
-   [X] Allow another layout where the editors are on the top
-   [X] try to use `resolve-file` package to try and resolve filenames
    given a require path - <https://www.npmjs.com/package/resolve-file>
-   [X] `resolve-file` only resolve the path of the file. If that file
    has a require('./x'), that will be sent by systemjs as
    `http://localhost/.rollick/x`, which then cannot be resolved by
    `resolve-file`
    -   What if we used `webpack` and bundled all node<sub>modules</sub> before
        sending them across? e.g. when systemjs asks for
        `http://localhost/.rollick/bluebird`, we send across
        `webpack({entry: 'bluebird'})`. Systemjs then won't have to
        resolve other paths.
    -   Or use browserify. The node api seems much nicer
    -   Or precreate a systemjs bundle for all the shared components. That
        would take care of all the node\\<sub>module</sub> dependencies.
        <https://github.com/systemjs/builder>

-   [ ] What if we tried merging host project package.json with rollick
    packge.json and somehow trying installing those dependencies with
    `jspm install npm:<npm_module_name>`? Only problem i could see is
    that sometimes `jspm install npm:<module_name>` fails for unknown
    reasons
-   [X] If user adds components from search/styleguide when cursor is in
    wrong position and leads to invalid jsx, automatically place
    componentat the end of the code
-   [X] In styleguide, when a component can't be loaded, user gets no
    feedback. The preview section is empty. Instead just show the last
    error itself. Also show helpful message in what might be the problem
    and how it can be probably fixed
-   [X] Script which allows you to use rollick with your own project.
    Steps for the script should be -
    -   [X] Copy needed stuff to .rollick folder inside that project
    -   [X] read rollick.config.js file in the root of the project
    -   [X] mainly pickup the component folder path from the config
    -   [X] generate the components meta file from the component path and
        store it inside .rollick folder
    -   [X] start server in project root
-   [X] Error handling in editors
-   [X] The name reactpen restricts future development scope to react
    users. Which should not be the case. Any component based architecture
    should be OK. Change the name. Jalebi? Nageen? Gambol? Jambol?
    Shenanigan? Kodai?
-   [X] Generate fake data only for required props. There's too much
    noise because of all the props being there in the editor. Most are
    not required for the component to function.
-   [X] What happens if users copy/paste some existing jsx consisting of
    components?
    -   [X] We get the names of all the possible components from output generated by

babel parser, find those components in the docgen meta file and try to load them.


<a id="bugs"></a>

# Bugs <code>[5/7]</code>

-   [X] Fix name generator from component path with index.js as the final
    file
-   [X] Fix the jumping search input box
-   [X] Fix the preview pane z index issue
-   [X] The editors go beyond 100% height. Looks like splitpane which
    covers the editors takes the height of grand parent (i.e. the whole
    page)
-   [X] When search bar is in focus, cannot focus the jsx editor by
    clicking on it. It works if i first click the css editor (which get's
    the focus) and then click the jsx editor
-   [ ] if the iframe (right pane) is in focus, keyboard events don't
    propagate to parent. So keybaord shortcuts don't work
-   [ ] clicking outside of search box should close it


<a id="server"></a>

# Rollick server - own server to serve files <code>[1/2]</code>

-   [X] Introduce concept of loaders through rollick.config file. E.g.
    using tildeLoader for less files in projectplace project
-   [ ] Use babel transpilation by default. Would take care of edge cases
    with named imports for ES6 modules which may/maynot work with
    systemjs currently
    -   [ ] rollick config should give an option to set custom babel
        presets and plugins
    -   [ ] add default presets and plugins used in babel in the server to
        npm dependencies list


<a id="projectplace"></a>

# Integrate with PP components <code>[3/4]</code>

-   [X] The font icons loaded when the class is activated goes directly
    to server. Need to rewrite path for those (from /harmony/fonts to
    /frontend/web/wwwroot/harmony/fonts)
-   [X] less file paths from pp/core/less folder. Imported as
    '~pp-common-<someting>' in many less files
    -   fixed it by writing custom server to serve js files. Passing all
        js files through babel and converting to commonjs file before
        being served to the browser. Not at all efficient but does the
        trick. package.json and use codemod to do the necessary changes
    -   fixed it by writing custom server to serve js files. Passing all
        js files through babel and converting to commonjs file before
        being served to the browser. Not at all efficient but does the
        trick.
-   [X] CSS still half breaks in a weird way. Probably connected to some
    other global css file.
    -   Looks like it breaks in weird ways all over the place, even in our
        system
-   [ ] Need to manually add proptypes for components which are missing
    proptypes. Also need to modify proptypes for components which do not
    specify the isRequired flag correctly.


<a id="ambititious"></a>

## Ambititious <code>[2/2]</code>

-   [X] since we already know how to show list of all components and load
    them when required with fake data, we can very easily generate a
    styleguide out of it. So the tool can morph between styleguide and
    reactor with almost zero cost! And since we have all the logic
    already for generating formatted jsx code for components, the preview
    pane for styleguide can have a text area inside where users can play
    with the props, just like styleguide by react velocity people.
-   [X] When showing the styleguide, user will have an option to open
    that component in rollick! Or a button which says "user this" or
    "copy code"

