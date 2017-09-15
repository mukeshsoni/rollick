### How to try it out

```
$ npm i
$ npm run build
$ node server.js
```

If you want to try it on any other project with components, you will need a rollick config file - name `rollick.config.js`. It looks like this

```
module.exports = {
    componentsPath: 'src/components',
    paths: {
        'fonts': 'path/to/fontsfile'
    },
    jspm: {
        paths: {
            lodash: '/node_modules/lodash/index.js',
            'lodash.words': '/node_modules/lodash.words/index.js',
            jquery: '/node_modules/jquery/dist/jquery.min.js',
            moment: '/node_modules/moment/min/moment-with-langs.min.js',
            bluebird: '/node_modules/bluebird/js/browser/bluebird.min.js'
        }
    },
    globals: {
        css: {
            urls: '/path/to/global.css'
        }
    }

}
```

And then run the following commands - 

```
$ npm i rollick -D
$ ./node_modules/rollick/index.js install
$ node .rollock/server.js --port 4001
```

This should start a localhost server on port 4001 and will serve the tool on <http://localhost:4001/.rollick/index.html>
