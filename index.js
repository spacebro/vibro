const Gpio = require('onoff').Gpio
const { SpacebroClient } = require('spacebro-client')
const settings = require('standard-settings').getSettings()
const vibro = new Gpio(17, 'in', 'rising', { debounceTimeout: 10 })
const client = new SpacebroClient(settings.service.spacebro)
let spaceBroConnected = false
vibro.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log('📳 - vibration occured')
  if (spaceBroConnected) {
    client.emit('vibration', {})
  }
})

client.on('connect', (data) => {
  spaceBroConnected = true
  console.log('Vibro is connected to server')
  client.emit('vibration', {})
})

process.on('SIGINT', _ => {
  vibro.unexport()
})
