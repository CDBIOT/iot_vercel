import { useState , useEffect } from "react"
import styles from "../../styles/Schedule.module.css"
import Axios from "axios"

function Schedule(){

const [temps, setData] = useState({})
const [initDate, setInitDate] = useState()
const [finalDate, setFinalDate] = useState()
const [Hora, setHora] = useState()
const [Minuto, setMinuto] = useState()
const horas= [0,1,2,3,4,5,6,7,8,9,10,11,12]
const minutos=[0,1,2,3,4,5,6,7,8,9,10]
console.log(horas)

async function mqtt_show() {
	const options = {
    'Access-Control-Allow-Origin':'*',
    method: 'GET',	
    mode: 'cors',
    cache: 'default',
    'Content-Type': 'application/json'}

   await Axios.get (('https://test-no-vercel.vercel.app/mqtt'),options)
	.then(response => {
	 setData(response.data.vm)
	console.log("dia: " ,response.data.vm.dia)
})
}

useEffect(() => {
    mqtt_show();
    }, [])

// function startTime() {
//         var today=new Date();
//         var h=today.getHours();
//         var m=today.getMinutes();
//         var s=today.getSeconds();
        
//         m=checkTime(m);
//         s=checkTime(s);
//         document.getElementById('txt').innerText= h+":"+m+":"+s;
//        const t=setTimeout('startTime()',500);
//     }
    

return (
    <>
    <h1>Schedule</h1>
    
    <div className = {styles.temp_show}>
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
            <td>Não Há Itens na lista</td>
            
            )
        }
        </table>
    
    </div>
    
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
<tr><th colspan = {6}><h2>Relógio Iot</h2></th></tr>
<tr><td><h1 colspan = {6}>Disparo </h1></td></tr>
    <tr> <td>
    <select onChange={(e) => setHora(e.target.value)}>
    <option value="" size="6" >Select Hora  </option>   
    {horas.map(hora=>{
        return<option value = {hora} key={hora}>  </option>
        })}
    </select>

    <input type="text" 	name = "horad"id= "hd" value = {Hora}  size="2" />

    <select onChange={e =>setMinuto(e.target.value)}> 
    <option value={Minuto}> Select min </option>  
        {minutos.map(min=>{
            return<option value= {min} key={min}> </option>
        })}
        </select>
	<input type="text"  name = "mind" id= "md" value = {Minuto}  size="6" /> 
     </td> 
</tr>



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