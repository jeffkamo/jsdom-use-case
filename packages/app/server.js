var Server = require('jsdom-use-case-sdk').default
var path = require('path')

console.log('App: start...')

const production = 'production'
const development = 'development'
const MODE = process.env.NODE_ENV === production ? production : development

console.log('MODE', MODE)

new Server({
    port: 9000,
    pathToPublic: path.join(__dirname, 'public')
})
