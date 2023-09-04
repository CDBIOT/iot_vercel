
import Axios from "axios";
import {useEffect, useState} from 'react';

function Users(){

const [peo, setPeople] = useState()


async function getUsers(){
    const options = { 
        'Access-Control-Allow-Origin':'*',
        method: 'GET',	
        mode: 'cors',
        cache: 'default',
        'Content-Type': 'application/json'}

    fetch(`https://test-no-vercel.vercel.app/user`,options)
        .then(response=>response.json())
        .then((data)=>{ 
        setPeople(data.people);
        console.log(data.people)
        console.log(peo)
        
    }).catch(err=> console.log(err))
        {
        console.log(peo)
        }
}
useEffect(() => {
            getUsers();
}, [])


return (
    <>
    <h1>Users</h1>
     
    {/* {
    peo.lenght >0 ? (
     peo.map((user,index)=>(  */}
    <div>
{/*   
    <table >
        <tbody>
 	        <tr key ={index}>
            <td>{user.id}</td>
            <td>{user.nome}</td>
            <td>{user.email}</td>
            </tr>
        </tbody>
    </table> */}
    </div>
     {/* )
     )) :( */}
{/*        
        peo.map((user, index) => */}
        {/* <tr key ={index}>
        <td>{user.id}</td>
        <td>{user.nome}</td>
        <td>{user.email}</td>
        </tr> */}
        
        {/* ) */}
     {/* ) */}
    {/* } */}
    </>
    
    )
}
    
export default Users
    
    
    