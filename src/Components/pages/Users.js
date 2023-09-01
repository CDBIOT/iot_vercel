
import Axios from "axios";
import {useEffect, useState} from 'react';

function Users(){

const [people, setPeople] = useState()
async function getUsers(){

const options = { 
        'Access-Control-Allow-Origin':'*',
        method: 'GET',	
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}

    fetch(`https://test-no-vercel.vercel.app/temps`,options)
        .then(response=>response.json())
         .then((data)=>{ 
        setPeople(data.people);
    }).catch(err=> console.log(err))
        {
        console.log(people)
        }
}
useEffect(() => {
            getUsers();
}, [])


    return (
    <>
    <h1>Users</h1>
     
    { people.map((user,index)=>( 
    <div>
    <h1>("Novo usuario" {user.nome}  ")</h1>
    <table >
        <tbody>
 	        <tr>
            <h2 id = "user"></h2>	
            <td>${user.id}</td>
            <td>${user.nome}</td>
            </tr>
        </tbody>
    </table>
    </div>
     ))
    }
    </>
    
    )
}
    
export default Users
    
    
    