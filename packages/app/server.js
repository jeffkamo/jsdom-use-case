var Server = require('jsdom-use-case-sdk').default
var path = require('path')

console.log('Server: start...')

new Server({
    port: 9000,
    pathToPublic: path.join(__dirname, 'public')
})
