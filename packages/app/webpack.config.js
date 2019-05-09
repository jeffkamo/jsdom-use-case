const path = require("path");
const webpack = require("webpack");

const BUILD_PATH = path.resolve(__dirname, "public")

const server = {
    name: 'server',
    target: 'node',
    entry: {
        main: "./server.js"
    },
    output: {
        path: BUILD_PATH,
        filename: 'server.js'
    }
}

const app = {
    name: 'app',
    target: 'web',
    entry: {
        main: './app.js'
    },
    output: {
        path: BUILD_PATH,
        filename: 'app.js'
    }
}

module.exports = [server, app]
