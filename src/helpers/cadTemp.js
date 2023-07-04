
async function cad_new_temp(){

    const options = {method: 'GET',	mode: 'cors',cache: 'default'}
    fetch('https://polar-beyond-82520.herokuapp.com/mqtt')
    .then(function (response){
    return response.text()})
    .then(data=>{
    const myObj 	= JSON.parse(data)
    const date 		= new Date();
    var local 		= document.getElementById('local').innerHTML= myObj.vm.local;
    var temperatura = document.getElementById('temperatura').innerText= parseInt(myObj.vm.temp);
    var dias 		= document.getElementById('dia').innerText= parseInt(date.getDate());
    var meses		= document.getElementById('mes').innerText= parseInt(date.getMonth()+ 1);
    var anos		= document.getElementById('ano').innerText= parseInt(date.getFullYear());
            
    const dados = {
        "local": (myObj.vm.local),
        "temperatura": parseInt(myObj.vm.temp),
        "dia": parseInt(myObj.vm.dia),
        "mes": parseInt(myObj.vm.mes),
        "ano": parseInt(myObj.vm.ano)
        }
    
    //const response = await fetch('http://127.0.0.1:8081/temps')
    const response = fetch('https://polar-beyond-82520.herokuapp.com/temps',{
    method: 'POST',	mode: 'cors',
    headers: { "Content-type": 'application/json'},
    body: JSON.stringify(dados)
    })
    })	
    .then((response) => {
        if(response.status == 200)
            {
            console.log('Cadastrada com sucesso');
            console.log(res.json());
            }else{
                console.log('Ocorreu um erro ao cadastrar!');
                list();
                    }
    
    }).catch((err) => {
    console.log('Ocorreu um erro no servidor \n Erro: '+ err);
        })
    }
    