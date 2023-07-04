

function show(user){

//let output = ''
//for (let user of users){
//		output += `<li>${user.name}</li>`
//	}
//	document.querySelector('user').innerHTML=output
	
	const tbody = document.getElementById('tbody')
	tbody.innerHTML = people.map( user=> {
//	people = document.createElement('user').innerHTML = person;

	//tbody.appendChild(people)
	document.write("Novo usuario" + user.nome + " ")

return `	<tr>
		<h2 id = "user"></h2>	
		<td>${user.id}</td>
		<td>${user.nome}</td>
		</tr>`
	})
}


async function getContent() {
		const options = {
			method: 'GET',
			mode: 'cors',
			cache: 'default'
		}

		try{
		fetch('http://127.0.0.1:8081/user').then(function (response){
			return response.json();
		})
		.then(function(data){
			console.log(data);
		})
	
		console.log(response)

		let output = ''
		for (let user of users){
			output += `<li>${user.local}</li>`
		}
		document.querySelector('user').innerHTML=output
	
		}catch (error){
			console.log(error)
		}
}


