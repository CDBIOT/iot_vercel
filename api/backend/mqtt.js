const express = require('express');
const router = express.Router();
const mqtt = require('mqtt')
const options = {
  // Clean session
  clean: true,
  connectTimeout: 4000,
  // Auth
  clientId: 'cdbiot123',
  username: 'test',
  password: 'test',
 reconnectPeriod: 1000,
}
const client  = mqtt.connect('mqtt://broker.mqtt-dashboard.com:1883', options)
client.on('connect', function () {
  console.log('Connected')
  client.subscribe('Temp_sala', function (err) {
    if (!err) {
      client.publish('bh/inTopic', '1')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  m = message;
  console.log(message.toString())
  client.end()
})

router.get('/', function (req, res) {
    /*Render the index.hbs and pass the View Model*/
    var vm = {
        title: 'MQTT',
        message: [new Date(), m]
    }
    console.log(vm.message);
    res.render('mqtt/index', vm);
});

router.get('/getsensordata', function (req, res) {
    var vm = {
    data:m
    };
    res.send(vm);
});

module.exports = mqtt;