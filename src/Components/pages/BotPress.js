
import Axios from "axios";
import {useEffect, useState} from 'react';

function BotPress(){

const [people, setPeople] = useState([])


async function getUsers(){
    const options = { 
        'Access-Control-Allow-Origin':'*',
        method: 'GET',	
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}

await Axios.get(`https://test-no-vercel.vercel.app/src/app`,options)
        .then(response=>{
        setPeople(response.data.people)
        console.log(response.data)        
    })
}
useEffect(() => {
    getUsers();
}, [])


return (
    <>
    <h1>BotPress</h1>
     
     {
    people.lenght >0 ? (
     people.map((user,index)=>(  
    <div>

    <table >
        <tbody>
 	        <tr key ={index}>
            <td>{user.id}</td>
            <td>{user.nome}</td>
            <td>{user.email}</td>
            </tr>
        </tbody>
    </table> 
    </div>
     )
     )) :( 
      
        people.map((user, index) => 
        <tr key ={index}>
        <td>{user.id}</td>
        <td>{user.nome}</td>
        <td>{user.email}</td>
        </tr> 
        
        ) 
      ) 
    } 
    </>
    
    )
}
    
export default BotPress
    
    
    