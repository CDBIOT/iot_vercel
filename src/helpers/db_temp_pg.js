const mqtt = require('mqtt');
const { Client } = require('pg');

const pg = new Client({
  host: 'postgres://CDBIOT:QBh5z4MvpsGr@ep-shrill-thunder-92608344.us-east-2.aws.neon.tech/neondb',
  user: "cdb",
  password:  "abcdeF12345",
  database: 'neondb',
  port: 3001
});

pg.connect();

const mqttClient = mqtt.connect('mqtt://localhost');

mqttClient.on('connect', () => {
  mqttClient.subscribe('esp32/dailylog');
});

mqttClient.on('message', async (topic, message) => {

  const logs = JSON.parse(message.toString());

  for (const entry of logs) {
    await pg.query(
      `INSERT INTO temps(Local,Temp,Data)
       VALUES($1,$2,$3,$4)`,
      [
        entry.Local,
        entry.Temp,
        entry.Data
      ]
    );
  }

  console.log("Log diario salvo no PostgreSQL!");
});