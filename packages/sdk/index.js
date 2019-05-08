const express = require('express')
const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM

const APP_TARGET = '#target'

class Server {
    constructor(options) {
        this._port = options.port || process.env.PORT
        this._url = options.url || 'http://localhost:' + this._port
        this._pathToAppScript = options.pathToAppScript || '/public/app.js'
        this._pathToPublic = options.pathToPublic || path.join(__dirname, 'public')
        this._configureExpressApp()
        this._startServer()
    }

    _executeApp() {
        return new Promise((resolve) => {
            this.window.renderComplete = resolve

            const appScript = this.document.createElement('script')
            appScript.src = this._pathToAppScript
            this.document.querySelector(APP_TARGET).appendChild(appScript)

            // Now we wait for app.js to invoke `resolve`
        }).then((window) => {
            // `window` is passed in from app.js
            return window.document.querySelector('html').outerHTML
        })
    }

    _renderApp() {
        const html = [
            '<!DOCTYPE html>',
            '<html>',
            '<head></head>',
            '<body id="target">',
                '<div>Waiting for App to mount...</div>',
            '</body>',
            '</html>'
        ].join('')

        const config = {
            contentType: 'text/html',
            runScripts: 'dangerously',
            resources: 'usable',
            url: this._url
        }

        const {window} = new JSDOM(html, config)
        const {document} = window

        this.window = window
        this.document = document
    }

    _configureExpressApp() {
        const sendFile = express.static(this._pathToPublic)
        const sendHTML = (req, res) => {
            this._renderApp()
            this._executeApp().then(
                (html) => res.send(html)
            )
        }

        this.app = express()
        this.app.get('/', sendHTML)
        this.app.use('/public', sendFile)
    }

    _startServer() {
        const listener = this.app.listen(this._port, function () {
            console.log('Your app is listening on port ' + listener.address().port)
        })
    }
}

module.exports = {
    default: Server
}
