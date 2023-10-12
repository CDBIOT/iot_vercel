import { useState , useEffect } from "react"
import styles from "../../styles/Schedule.module.css"
import Axios from "axios"

function Schedule(){

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
const horas= [0,1,2,3,4,5,6,7,8,9,10,11,12]
const minutos=[0,1,2,3,4,5,6,7,8,9,10]
console.log(horas)

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

function startTime() {
    const timer = setInterval(() =>{
        const date = new Date()
        setDateTime({
            hours:date.getHours(),
            minutes:date.getMinutes(),
            seconds :date.getSeconds()
        })
    },1000)
    return ()=> clearInterval(timer)
}

useEffect(() => {
    startTime();
    }, [])
    

return (
    <>
    <h1>Schedule</h1>
    <table>
    <tr><td  >Temperatura: {temp[temp]} Local: { local } Data:{ dia } / { mes } / { ano }</td></tr>
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
        <table>
            <th colspan = {6}><h2>Set Time Light</h2> </th>
            <tr><td><input id="initDate" value={initDate}  type="date" onChange={(e)=>setInitDate(e.target.value)}  name="initDate" />
                <label >Data Inicial: {initDate}</label>
            </td> 
            <td><input id="finalDate" value={finalDate}  type="date" onChange={(e)=>setFinalDate(e.target.value)}  name="finalDate" /> 
                <label>Data final: {finalDate}</label>
            </td>
            </tr>
        </table>

<table>
    <br></br>

<tr><th colspan = {6}><h2>Relógio Iot</h2></th></tr>

<tr><h1>{dateTime.hours} : {dateTime.minutes} : {dateTime.seconds}</h1></tr>

<tr><td><h1 colspan = {6}>Disparo </h1></td></tr>
    <tr> <td>

    <select onChange={(e) => setHora(e.target.value)}>
    <option value="" size="6" >Select Hora  </option>   
    {horas.map(hora=>{
        return<option value = {hora} key={hora}>{hora}  </option>
        })}
    </select>

    <input type="text" 	name = "horad"id= "hd" value = {Hora}  size="2" />

    <select onChange={e =>setMinuto(e.target.value)}> 
    <option value={Minuto}> Select min </option>  
        {minutos.map(min=>{
            return<option value= {min} key={min}>{min} </option>
        })}
        </select>
	<input type="text"  name = "mind" id= "md" value = {Minuto}  size="6" /> 
     </td> 
</tr>

<br></br>

    <tr><th colspan = {6}><h2>Tempo ligado </h2></th></tr>
	<tr>
	    <td><input type="text" id="tempod" value="" maxlength="10" /></td> 
	    <td><h2 id="tempo"></h2></td>
         <td><h1 id = "disp"> </h1></td>
    </tr>
    <tr> <th colspan ={6}>Estado</th></tr>
    <tr>
        <span id="rele">N/D</span>
    </tr>
    <tr><td>
	    <input type="button" id="btnOn"   value="Ligar"    onClick="setRelay(1)"/>
	    <input type="button" id="btnOff"  value="Desligar" onClick="setRelay(0)"/>
	    <input type="button" id="btndisp" value="Setar"    onClick="setdisp()"/>
    </td></tr>
    </table>
        </form>
    </div>
</section>

    </>
    
    )
    
    }
    export default Schedule