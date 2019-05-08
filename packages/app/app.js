const APP_TARGET = '#target'

console.log('App script running...')
const app = document.createElement('div')
app.innerHTML = 'This element was rendered server side (duplicate rendered client side)'
document.querySelector(APP_TARGET).appendChild(app)

// And we're done!
window.renderComplete(window)

console.log('App script complete...')
window.renderComplete()
