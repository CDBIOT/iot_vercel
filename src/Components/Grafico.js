import styles from "../styles/Graphics.module.css"
import { Chart } from "react-google-charts"
import Axios from "axios";
import React from "react";
import {useEffect, useState} from 'react';


function Grafico(){

const [temps, setTemperaturas] = useState()
const [options, setOptions] =[ {title: 'Grafico de Temperaturas'}];
const [data, setData] = useState('')
const [startDate,setstartDate] =useState()
const [finalDate,setfinalDate] =useState()

useEffect(() => {


const options = { 
        'Access-Control-Allow-Origin':'*',
        method: 'GET',	
        mode: 'no-cors',
        cache: 'default',
        'Content-Type': 'application/json'}

    Axios.get({
	  	url: 'https://test-no-vercel.vercel.app/temps',options
		})
    .then((response) =>{
    setTemperaturas(response.data.temps);
    {   
   // console.log()
    }
});
}, []);

const handleChange = (e) => {
    e.preventDefault()
    setData(e.target.value)
}

return(
<>

<section className={styles.chart}>
      
      <form className="search" action="/" method="post">
              <div className="row">            
                  <div className="">
                      <label for="startDate" className={styles.label}>Data Inicial</label>
                      <input id="startDate" value={startDate} className="form-control" onChange={(e) => setstartDate(e.target.value)} type="date" name="startDate" />
                  </div>
                  <div className="col-md-4">
                      <label for="finalDate" className={styles.label}>Data final</label>
                      <input id="finalDate" value={finalDate} className="form-control" onChange={(e) => setfinalDate(e.target.value)} type="date" name="finalDate" />
                      </div>
                  <div className="col-md-4">
                      <button className="bnt-exit" type="submit">Pesquisar</button>
                      
                  </div>
              </div>
          </form>
          
      </section>

<Chart 
	    chartType="AreaChart"
	    width = "400"
	    height= "300"
	    data = {data}
	    options= {options}
	 />
</>

)
}
export default Grafico