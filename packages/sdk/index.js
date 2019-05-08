var express = require('express')
var fs = require('fs')
var path = require('path')
var jsdom = require('jsdom')
var JSDOM = jsdom.JSDOM

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

    _renderApp() {
        var html = [
            '<!DOCTYPE html>',
            '<html>',
            '<head></head>',
            '<body id="target">',
                '<div>Waiting for App to mount...</div>',
            '</body>',
            '</html>'
        ].join('')

        var config = {
            contentType: 'text/html',
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true,
            strictSSL: true,
            url: this._url
        }

        var serverWindow = new JSDOM(html, config).window
        var serverDocument = serverWindow.document

        return new Promise((resolve) => {
            serverWindow.renderComplete = resolve

            const appScript = serverDocument.createElement('script')
            appScript.src = this._pathToAppScript
            serverDocument.querySelector(APP_TARGET).appendChild(appScript)

            // Now we wait for app.js to invoke `resolve`
        }).then((window) => {
            // `window` is passed in from app.js
            return window.document.querySelector('html').outerHTML
        })
    }

    _configureExpressApp() {
        var handlePublic = express.static(this._pathToPublic)
        var handleRoot = (req, res) => {
            this._renderApp()
                .then((html) => res.send(html))
        }

        this.app = express()
        this.app.get('/', handleRoot)
        this.app.use('/public', handlePublic)
    }

    _startServer() {
        var listener = this.app.listen(this._port, function () {
            console.log('Your app is listening on port ' + listener.address().port)
        })
    }
}

module.exports = {
    default: Server
}
