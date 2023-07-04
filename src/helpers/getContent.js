
async function getContent() {
	//Obtem dados do banco de dados
		const options = {
						method: 'GET',
						mode: 'cors',
						cache: 'default'
						}
		fetch('https://polar-beyond-82520.herokuapp.com/temps')
		//fetch('http://127.0.0.1:8081/temps')
		.then(function (response){
			return response.text()})
		.then(data=>{
		const myObj = JSON.parse(data)
		console.log(data)
		position= myObj.temps.entries
		var tamanho= 0;  
			 for (const position in data) {
   			if (data.hasOwnProperty(position))
			 {
      			  tamanho++;
   				 }
			}		 
			for (var k in myObj.temps){
			for (const [key, value] of Object.entries (myObj.temps[k])) {
		console.log(`${key}: ${value}`);
			}
		}

			for (var i in myObj.temps) {
		console.log(i + " - " + myObj.temps[i].temperatura)
		console.log(i + " - " + myObj.temps[i].temperatura)
			}

		console.log("tamanho: ", i)
		console.log("position: ", position)
			//for (var i = 0; i < data.length; i++)
				{	
			var local = document.getElementById('local').innerHTML= myObj.temps[i].local;
			var temperatura = document.getElementById('temperatura').innerHTML= myObj.temps[i].temperatura;
			var dia = document.getElementById('dia').innerHTML= myObj.temps[i].dia;
			var mes = document.getElementById('mes').innerHTML= myObj.temps[i].mes;
			var ano = document.getElementById('ano').innerText= myObj.temps[i].ano;
		}
		//let divid = document.querySelector(".id")
			//const list = document.querySelector('#fill_list')
		
		})			
}
