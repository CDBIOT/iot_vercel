//import mqtt from "precompiled-mqtt";
import mqtt from "mqtt"
import styles from "../../styles/Graphics.module.css"
import React, { useState, useRef , useEffect } from "react"
import {Connector} from "mqtt-react-hooks"
import { useMqttState } from 'mqtt-react-hooks';


const topic1 = 'bh/inTopic'
const topic2 = 'room_light'
const topic3 = 'aqua_light'
const topic4 = 'Quarto'
const topic5 = 'Sala'

function MqttReact(){
   const topic = 'Sala';
   const path = '/mqtt';
   const payload = 'temp';
   const hosthive = "5d3be4977c10482289edf71c15f420fe.s1.eu.hivemq.cloud";
   const host = 'broker.mqtt-dashboard.com'
   const port = '8884'
   const clientId = "cdbiot123";
   const clientRef = useRef(null);

   //const clientId = 'mqttjs_'+ Math.random().toString(16).slice(3)
   
   const connectUrl = 'wss://broker.mqtt-dashboar.com:8884/mqtt';
   const options = {
        host: host,
        port: port,
        clientId: clientId,
        clean: true,
        connectTimeout: 5000,
        username: 'test',
        password: 'test',
        reconnectPeriod: 10000,
        topic: topic2
     }
     
//const {connectionStatus} = useMqttState();

//const client = (mqtt.connect(connectUrl,options))

  //const[client, setClient] = useState(null)
  const[connectionStatus, setConnectionStatus] =useState()
  const[messages, setMessages]=useState('')
  const[temp,setTemp]= useState([])
  const[local,setLocal]= useState([])

useEffect(() =>{
  
 try{
const client = (mqtt.connect(connectUrl,options))
    console.log('Connected to MQTT broker')
  
 }catch (error){console.log('mqtt.connect error',error)}
 

//  if(!clientRef.current){
//   const client = mqtt.connect(connecturl,options);
//    clientRef.current = client
 

 try{
 client.on('connect', () => {
   setConnectionStatus(true)
   console.log('Connected to MQTT broker')
 }
 
 )
}catch (error){console.log('mqtt.connect error',error)}
}


try{
client.subscribe(topic, () => {
  console.log("Subscribe to topic:", +topic)
}) }catch(error)
{
  console.error(error)
}

client.stream.on('error', (err) => {
  console.error(`Connection failed: ${err.message}`);
  client.end();
});

client.on('message', (topic, payload) => {
setMessages(payload.toString())
     //temp = payload
     //local= topic
     console.log('Received Message:',+ messages + payload.toString(),"From:", +topic.toString())
   // res.status(200).json({m})
 })


 // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: true }, (error) => {
//  if (error) {
    //  console.error(error)
//    }
 // })

},[]);
console.log("Connection: " +connectionStatus)
console.log("Messages: " +messages)

// setInterval(() => {
// client.on('message', (topic, payload) => {
//   temp = payload.toString()
//   console.log('Received Message:', topic, temp)
//   client.end()
//  // res.status(200).json({m})
// })
  
// }, 1000);

 return(
  <div>
    
{/*<Connector brokerUrl='wss://broker.mqtt-dashboard.com:1883/mqtt'/>
<Connector brokerUrl='wss://5d3be4977c10482289edf71c15f420fe.s1.eu.hivemq.cloud:8884/mqtt' />
<Connector brokerUrl='wss://broker.mqtt-dashboard.com:8884/mqtt' />*/}
    <label >Status:<h2> {connectionStatus}</h2></label> 
				<table className = {styles.table}>   
					<tr><th className = {styles.thead} colSpan={2}>TEMPERATURA DA SALA </th></tr>
					<tr>
						<td>Local: </td><td colSpan={4}><h2>{topic}</h2></td>
						<td>Temp: </td><td colSpan={4}><h2>{payload}</h2></td> 
            <td>Message: </td><td colSpan={4}><h2>{messages}</h2></td> 

					</tr>
        </table> 
  </div>
  
 )
}
export default MqttReact