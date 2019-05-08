var express = require('express')
var fs = require('fs')
var path = require('path')
var JSDOM = require('jsdom').JSDOM

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
        var pathToSrc = `${this._url}${this._pathToAppScript}`

        var html = [
            '<!DOCTYPE html>',
            '<html>',
            '<head></head>',
            '<body id="target">',
                '<div>Waiting for App to mount...</div>',
                `<script src="${pathToSrc}"></script>`,
            '</body>',
            '</html>'
        ].join('')

        var config = {
            contentType: 'text/html',
            pretendToBeVisual: true,
            strictSSL: true,
            url: this._url
        }

        return new JSDOM(html, config)
            .window
            .document
            .querySelector('html')
            .outerHTML
    }

    _configureExpressApp() {
        this.app = express()

        this.app.get('/', (req, res) => {
            var html = this._renderApp()
            res.send(html)
        })

        console.log('- - - - - - - - - - - - - - - - - - - - -')
        console.log('path to /public -> ', this._pathToPublic)

        this.app.use('/public', express.static(this._pathToPublic))
    }

    _startServer() {
        var listener = this.app.listen(this._port, function () {
            console.log('Your app is listening on port ' + listener.address().port)
        })
    }

    _loadAppScript() {
        var path = this._pathToAppScript
        try {
            source = fs.readFileSync(path, 'utf-8')
        } catch (err) {
            console.error(
                `Could not load ${path}: ${err}`
            )
        }
    }
}

module.exports = {
    default: Server
}
