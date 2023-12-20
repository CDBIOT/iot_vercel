const mqtt = require('mqtt');
const routers = require('./rotas_temps');

const host = 'broker.mqtt-dashboard.com'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = 'Sala'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)

client.on('message', (topic, payload) => {
      temp = payload
      local= topic
     // console.log('Received Message:', topic, payload.toString())
      //res.status(200).json({m})
    })
  })
})
setInterval(() => {
client.on('message', (topic, payload) => {
  temp = payload.toString()
  console.log('Received Message:', topic, temp)
  client.end()
 // res.status(200).json({m})
})
  
}, 1000);

// const topic2 = 'Quarto'
// client.on('connect', () => {
//   console.log('Connected')
//   client.subscribe([topic2], () => {
//     console.log(`Subscribe to topic '${topic2}'`)

// client.on('message', (topic2, payload) => {
//       temp = payload
//       local= topic2
     // console.log('Received Message:', topic, payload.toString())
      //res.status(200).json({m})
//     })
//   })
// })

 // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: true }, (error) => {
//  if (error) {
    //  console.error(error)
//    }
 // })
module.exports = mqtt