import styles from "../../styles/Graphics.module.css"
import React from "react";
import {useEffect, useState} from 'react';


function RealTime(){
  const [tempes, setTemperaturas] = useState([])
  const [query,setQuery] = useState("")
  

  const dias =tempes.map((t, i) =>{return tempes.indexOf(t.dia)===i})
  //const days = tempes.forEach((day) => {dias.filter(day>=1)})
  //filtro de dias
  const temp = tempes.filter(temper=>(temper.dia < query))

  console.log("dias: ", [...dias.values()])
  console.log("temp: ", temp)

 
  const lista = [
    // <ul>{temp = tempes.filter((valorAtual)=> {
    //   return valorAtual.dia.includes(10)
    // })}</ul>
    //<ul>{tempes.map((t,i) => (<li key={t}> {t.filter((d)=>{return d.include(10)})}</li> ))}</ul>
  ]
     console.log("lista: ", lista)
  

async function DrawTable(){
        //Obtem dados do banco de dados

     fetch(`https://test-no-vercel.vercel.app/temps`,{
      method: 'GET',
      header: {'Access-Control-Allow-Origin':'*',mode: 'cors',
        'Content-Type': 'application/json' },
     }).then(resp=>resp.json())
 	    .then((data)=>{
 	    setTemperaturas(data.temps)
       console.log(data.tempes)
      }).catch(err=> console.log(err))
    }
         
useEffect(() => {
  DrawTable();
}, [])

return (
    <>
    <h1>RealTime</h1>

    <select onChange={e =>setQuery(e.target.value)}>
    <option value="" disabled default selected> Select day  </option>
    {tempes.map(dia=>{
        return<option key={dia}>{dia.dia} </option>
      })}
    </select>
          
     <input type ="text" onChange={(e)=>setQuery(e.target.value)}></input>
    
    <div>   
         <table className={styles.table}>
          <tr><th className={styles.th} colSpan={4}>
          <td width="20%"className={styles.th}>Temp</td>
          <td width="20%" className={styles.th}>Local</td>
          <td width="20%" className={styles.th}>Dia</td>
          <td width="20%" className={styles.th}>Mes</td>
          <td width="20%" className={styles.th}>Ano</td>
          </th></tr>
      </table>
      </div>
          <tbody className={styles.tbody}>
          {tempes.length >0 ? (
          temp.map((t, i) => (
          <tr key = {i}>
          <td width="20%"className={styles.td}>{t.temperatura}</td>
          <td width="20%"className={styles.td}>{t.local}</td>
          <td width="20%"className={styles.td}>{t.dia}</td>
          <td width="20%"className={styles.td}>{t.mes}</td>
          <td width="20%"className={styles.td}>{t.ano}</td></tr>
          )
          )) :(
              <h3>Não há itens na lista</h3>
          )}
                    
         
         
          </tbody>
    </>
    )
    
    }
    export default RealTime