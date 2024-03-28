import { useState , useEffect } from "react"
import styles from "../../styles/Schedule.module.css"
import Axios from "axios"

function Schedule(){

const topic = "Sala"
const message = "1"

const date = new Date();
const [temps, setData] = useState({})
const [temp,setTemp] = useState()
const [dia,setDia] = useState()
const [mes,setMes] = useState()
const [ano,setAno] = useState()
const [local,setLocal] = useState()
const [initDate, setInitDate] = useState()
const [finalDate, setFinalDate] = useState()
const [Hora, setHora] = useState()
const [Minuto, setMinuto] = useState()
const [dateTime , setDateTime] = useState({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
})
const horas = [];
for (let i = 0; i <= 24; i++) {
  horas.push(i);
}

const minutos = [];
for (let i = 1; i <= 60; i++) {
  minutos.push(i);
}


async function mqtt_show() {
	const options = {
    'Access-Control-Allow-Origin':'*',
    mode: 'cors',
    cache: 'default',
    'Content-Type': 'application/json'}

   await Axios.get (('https://test-no-vercel.vercel.app/mqtt'),options)
	.then(response => {
	 setData(response.data.vm)
     setTemp(response.data.vm.temp)
     setDia(response.data.vm.dia)
     setMes(response.data.vm.mes)
     setAno(response.data.vm.ano)
     setLocal(response.data.vm.local)
	console.log("temp: " ,response.data.vm.temp)
    console.log("dia: " ,response.data.vm.dia)
})
}

useEffect(() => {
    mqtt_show();
    }, [])

// function startTime() {
//     const timer = setInterval(() =>{
//         const date = new Date()
//         setDateTime({
//             hours:date.getHours(),
//             minutes:date.getMinutes(),
//             seconds :date.getSeconds()
//         })
//     },1000)
//     return ()=> clearInterval(timer)
// }

useEffect(() => {
   // startTime();
    }, [])
    
async function onLamp() {
    const options = {
        'Access-Control-Allow-Origin':'*',
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}
    
       await Axios.get (('https://test-no-vercel.vercel.app/mqtt'),options)
        .then(response => {
            console.log("Lamp ON")
        }
        )
}

async function offLamp() {
    const options = {
        'Access-Control-Allow-Origin':'*',
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}
    
       await Axios.get (('https://test-no-vercel.vercel.app/mqtt2'),options)
        .then(response => {
            console.log("Lamp OFF")
        }
        )


}

async function onPump() {
    const options = {
        'Access-Control-Allow-Origin':'*',
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}
    
       await Axios.get (('https://test-no-vercel.vercel.app/publisher'),options)
        .then(response => {
            console.log("Lamp OFF")
        }
        )


}

async function offPump() {
    const options = {
        'Access-Control-Allow-Origin':'*',
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}
    
       await Axios.post (('https://test-no-vercel.vercel.app/subscriber'),options)
        .then(response => {
           // {topic,message}
            console.log("Lamp OFF")
        }
        )


}

return (
    <>
    <h1>Schedule</h1>
        <table className = {styles.table}>
            <tr><td className={styles.thead}  >Temperatura: {temps[temp]} </td><td> Local: { local }</td><td> Data: { dia } / { mes } / { ano }</td></tr>
            

        <tr className={styles.tr}><h2 className={styles.h2}>{dateTime.hours} : {dateTime.minutes} : {dateTime.seconds}</h2></tr>
        </table>
    {/* <div className = {styles.temp_show}>
        <table>
           
	        <tr><th colspan = {6}><h1>TEMPERATURA DO QUARTO </h1></th></tr>
          
            {temps.length >0 ? (
            
            temps.map((t,i)=>(
            <tr key = {i}>
                <td width="20%"className={styles.td}>{t.temp}</td> 
                <td width="20%"className={styles.td}>{t.local} </td> 
	            <td width="20%"className={styles.td}>{t.dia} </td>
                <td width="20%"className={styles.td}>{t.mes} </td>
                <td width="20%"className={styles.td}>{t.ano} </td>
            </tr>
            )
         )): ( 
            <h4>Não há itens na lista</h4>
         )
        }
        </table>
    
    </div> */}
    
    <section>
<div>
    <form action="Relogio" method="post">
        <table className = {styles.table}>
            <tr className={styles.tr}><td>Disparo</td></tr>
            <tr className={styles.tr}>
                <td className={styles.td}><label>Data Inicial: </label></td>
                <td className={styles.td}><input id="initDate" value={initDate}  type="date" onChange={(e)=>setInitDate(e.target.value)}  name="initDate" /></td></tr>
            <tr className={styles.tr}>
                <td className={styles.td}><label>Data final: </label></td>
                <td><input id="finalDate" value={finalDate}  type="date" onChange={(e)=>setFinalDate(e.target.value)}  name="finalDate" /></td>
            </tr>
       
<br></br>
        <tr className={styles.tr}>
        <td className={styles.td}>
        <label>Set Hour:  </label></td>
        <td className={styles.td}>
        <select onChange={(e) => setHora(e.target.value)}>
            <option value="" size="6" >Select Hour  </option>   
                {horas.map(hora=>{
                 return<option value = {hora} key={hora}> {hora} <input type="text" 	name = "horad"id= "hd" value = {Hora}  size="2" /> </option>
                 })}
        </select>
        </td>
        </tr>
        <tr className={styles.tr}>
        <td className={styles.td}>
        <label>Set Minutes:  </label></td>
        <td className={styles.td}>
        <select onChange={e =>setMinuto(e.target.value)}> 
            <option value={Minuto}> Select min </option>  
                {minutos.map(min=>{
                return<option value= {min} key={min}> {min} <input type="text"  name = "mind" id= "md" value = {Minuto}  size="6" /> </option>
                })}
        </select>

        </td> 
        </tr>


<br></br>
        <tr><th className = {styles.thead}><h2>Tempo ligado </h2></th></tr>
	    <tr>
	        <td><input type="text" id="tempod" value="" maxlength="10" /></td> 
	        <td><h2 id="tempo"></h2></td>
            <td><h1 id = "disp"> </h1></td>
        </tr>
        <tr> <th colspan ={6}>Estado</th>
            <span id="rele">N/D</span>
        </tr>
        <tr><td>
	        <input className={styles.button} type="button" id="onlamp"   value="onLamp"    onClick= {onLamp}/>
            <input type="button" id="offlamp"   value="offLamp"    onClick={offLamp}/>
	        <input type="button" id="pump"  value="setPump" onClick={onPump}/>
	        <input type="button" id="vent" value="setVent"    onClick={offPump}/>
        </td></tr>
    </table>

</form>

    </div>

</section>

    </>
    
    )
    
    }
    export default Schedule