This respository is meant to demonstrate the use case that my organization uses JSDOM for one of its projects.

Specifically, our project is an SDK library that includes a set of tools streamline creating server-side rendered a JavaScript applications.


# Architecture

## SDK -> server.js

The server class is an express application designed to run locally as well as in an AWS Lambda. It's primary purpose is to run the JS App in a JSDOM environment and print its rendered HTML as a string, then send it to the client.


## App -> app.js

The app would normally be a React app, but for demonstration purposes, it's just a JavaScript that generates some simple DOM elements that will be rendered by the server.

The app.js file does two things:

1. Exports an instance of the SDK server module that is configured to run app.js
2. Defines the front-end JS application that the server will render

The app.js file is packaged with Webpack to be distributed to an AWS Lambda.


# How to test

## Pre-requisites

Run `npm ci` (or `npm i`) and then `lerna bootstrap`


## Run the App

1. From this project root run `cd packages/app`
2. Run `npm i && npm run build && npm start`
3. Observe the error in the console. You should see something like this:

```
ERROR in ../sdk/~/jsdom/lib/jsdom/utils.js
    Module not found: Error: Can't resolve 'canvas' in '/Users/Atsushi/Mobify/_lab/jsdom-use-case/packages/sdk/node_modules/jsdom/lib/jsdom'
     @ ../sdk/~/jsdom/lib/jsdom/utils.js 166:2-27 172:17-34
     @ ../sdk/~/jsdom/lib/jsdom/browser/Window.js
     @ ../sdk/~/jsdom/lib/api.js
     @ ../sdk/index.js
     @ ./server.js
```


## Workaround

The error above can be bypassed by the following (horrible) hack:

1. From this project root run `cd packages/sdk`
2. Open `node_modules/jsdom/lib/jsdom/utils.js`
3. Delete or comment out the following lines...

    ```
    let canvasInstalled = false;
    try {
      require.resolve("canvas");
      canvasInstalled = true;
    } catch (e) {
      // canvas is not installed
    }
    if (canvasInstalled) {
      const Canvas = require("canvas");
      if (typeof Canvas.createCanvas === "function") {
        // In browserify, the require will succeed but return an empty object
        exports.Canvas = Canvas;
      }
    }
    ```

4. Repeat the "Run the App" steps above. The server should start now
5. Visit [http://localhost:9000/](http://localhost:9000/)
6. The mock application should start, and the "Example App has been mounted!" text should appear