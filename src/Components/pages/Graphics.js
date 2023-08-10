import styles from "../../styles/Graphics.module.css"
import React from "react";
import axios from "axios";
import {useEffect, useState} from 'react';
import _ from 'lodash'; 
import moment from "moment/moment";
import Grafico from "../Grafico";

function Graphics(){
    
    const [temps, setTemperaturas] = useState([])
    const [initDate, setInitDate] = useState()
    const [finalDate, setFinalDate] = useState()
    const [initMonthy, setInitMonthy] = useState()
    const [finalMonthy, setFinalMonthy] = useState()
    

    const startDate = moment(initDate).format("DD");
    const startDay = parseInt(startDate)
    const endDate = moment(finalDate).format("DD");
    const endDay = parseInt(endDate)

    const startMonthy = moment(initMonthy).format("MM");
    const startMont = parseInt(startMonthy)
    const endMonthy = moment(finalMonthy).format("MM");
    const endMont = parseInt(endMonthy)
    
    const temp = temps.filter(temper =>  temper.dia  >= startDay )
    const temp2 = temp.filter(temper =>  temper.dia  <= endDay )

    const temp3 = temp2.filter(temperM =>  temperM.mes  >= startMont )
    const temp4 = temp3.filter(temperM =>  temperM.mes  <= endMont )


async function getData(){
    const options = { 
        'Access-Control-Allow-Origin':'*',
        method: 'GET',	
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}

     fetch(`https://test-no-vercel.vercel.app/temps`,options)
    .then(response=>response.json())
 	.then((data)=>{ 
    setTemperaturas(data.temps)
     console.log(data.temps)
     }).catch(err=> console.log(err))
    }

useEffect(() => {
    getData();
    }, [])
    


return (
    <>
    <h1>Graphics</h1>
    <Grafico/>
<table>
<th colspan = {4}> <h1> Selecione o período </h1></th>
<tr>
    <td>
        <h2 for="initDate" className="label">Data início:  {startDate} "/" {startMont} </h2>
     
        <input id="initDate" value={initDate}  type="date" onChange={(e)=>setInitDate(e.target.value)}  name="initDate" /></td>
        <td> </td>
    <td>
        <h2  for="finalDate" className="label">Data Final:  {endDate}  / {endMont} </h2>
        <input id="finalDate" value={finalDate}  type="date" onChange={(e)=>setFinalDate(e.target.value)}  name="finalDate" /></td>
        <td></td> 
</tr>
</table>

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
        {temps.length >0 ? (
        temp4.map((t, i) => (
        <tr key = {i}>
        <td width="20%"className={styles.td}>{t.temperatura}</td>
        <td width="20%"className={styles.td}>{t.local}</td>
        <td width="20%"className={styles.td}>{t.dia}</td>
        <td width="20%"className={styles.td}>{t.mes}</td>
        <td width="20%"className={styles.td}>{t.ano}</td></tr>
        )
        )) :(
            temps.map((t, i) => (
                <tr key = {i}>
                <td width="20%"className={styles.td}>{t.temperatura}</td>
                <td width="20%"className={styles.td}>{t.local}</td>
                <td width="20%"className={styles.td}>{t.dia}</td>
                <td width="20%"className={styles.td}>{t.mes}</td>
                <td width="20%"className={styles.td}>{t.ano}</td></tr>
                )
                )
        )}
       
        </tbody>
    </>
)
    
}
export default Graphics