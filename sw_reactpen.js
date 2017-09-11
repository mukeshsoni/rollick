self.addEventListener('install', function(event) {
    // Perform install steps
})

self.addEventListener('activate', function(event) {
    // You're good to go!
    console.log('good to go')
})

function last(arr) {
    if (arr && arr.length > 0) {
        return arr[arr.length - 1]
    } else {
        return null
    }
}

function send_message_to_client(client, msg) {
    return new Promise(function(resolve, reject) {
        var msg_chan = new MessageChannel()

        msg_chan.port1.onmessage = function(event) {
            if (event.data.error) {
                reject(event.data.error)
            } else {
                resolve(event.data)
            }
        }

        client.postMessage(msg, [msg_chan.port2])
    })
}

self.addEventListener('fetch', function(event) {
    if (last(event.request.url.split('.')) === 'css') {
        // just intercepting css links and injecting them to iframe is not enough.
        // it's important that we stop the main page to load css for these components, since that css might interfere with the main page css
        // one way is to somehow determine that css loaded later on is all about components loaded dynamically. service worker can then send empty content. I think this service worker cannot intercept the network requests from the iframe. Hence the iframe will load the correct css
        // how to determine if the css is for component to be loaded dynamically?
        // the path will have something from the component path given in rollick config file or from the paths/strings specified in `map` of systemjs. can probably find a substring match for one of those in the url
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                send_message_to_client(client, event.request.url)
            })
        })
    }
})
