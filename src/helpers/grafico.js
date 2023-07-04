setInterval(function()
{
//	getData();
	 // drawGraph();
  //drawAjax();
  // draw_Chart2();
}, 10000);


//  function Dia(){
// // // //   google.charts.load('current',{ packages:['corechart']}).then(function () {
    
//       var resposta =$.ajax({
//        method: 'GET',
//        url: 'https://polar-beyond-82520.herokuapp.com/temps'
// //       dataType: "json",
//          }).done (function(resposta) {
// // //    drawChart(result);
//           var dataArray = Array.from(resposta.temps);

//          var data = new google.visualization.DataTable(dataArray)
//          data.addColumn('number', 'Dia');
//          data.addColumn('number', 'Temperatura');

//          for (var i in resposta.temps)
//          {
//             let dia = resposta.temps[i].dia
//             let temperatura = resposta.temps[i].temperatura
//              data.addRow([dia, temperatura])
//           }
//        console.log(resposta);  
   
//       var chart = new google.visualization.LineChart(document.getElementById('graph_dia'));
//       chart.draw(data, {width: 400, height: 240});
//     }
// }


  function Dia(result)
  {
     
  const options = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
                   }
  const response =fetch('https://polar-beyond-82520.herokuapp.com/temps')
  .then(function (response){
    return response.text()})
    .then(data=>{
    const myObj = JSON.parse(data);
    var dataArray = Array.from(myObj.temps);
    console.log("dataArray: ", dataArray)

    var dataArray2=[];

    dataArray2.push(['Dia','Temp']);

    for (var i in dataArray)
    {
        dataArray2.push([dataArray[i].dia, (dataArray[i].temperatura)]);
    }

    const dados_graf = {
      chart: null,
    
    data2 : dataArray2,
    element: '#graph_dia',
    options  : {
        'title' : 'Temperatura x Dia',
        'width' : 400,
        'height': 300
      }
    }
    dados_graf.chart = new google.visualization.LineChart(
      document.querySelector(dados_graf.element));
   
    dados_graf.chart.draw(
      google.visualization.arrayToDataTable(dados_graf.data2),
      dados_graf.options
      )
    })  // final do query
  
}  
        
async function Mes(){	
  const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
                     }
    const response =fetch('https://polar-beyond-82520.herokuapp.com/temps')
    //const response = fetch('http://127.0.0.1:8081/mqtt')
    .then(function (response){
    return response.text()})
    .then(data=>{
    //console.log(data)
    const myObj = JSON.parse(data)
    var dataArray = Array.from(myObj.temps);
    console.log("dataArray:",dataArray)
    dataArray2=[];
    dataArray2.push(['Mês','Temp']);

    for (var i in dataArray){
      dataArray2.push([dataArray[i].mes, (dataArray[i].temperatura)]);
  }
   console.log("dataArray2:",dataArray2)
  
   const dados_graf = {
    chart: null,
  
    data2 : dataArray2,
    element: '#graph_mes',
    options  : {
      'title' : 'Temperatura X Mês',
      'width' : 400,
      'height': 300
    }
  }
    dados_graf.chart = new google.visualization.LineChart(
      document.querySelector(dados_graf.element));
   
    dados_graf.chart.draw(
      google.visualization.arrayToDataTable(dados_graf.data2),
      dados_graf.options
      )
    })  // final do query
}
  function Ano()
  {
    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
                     }
                     
    const response =fetch('https://polar-beyond-82520.herokuapp.com/temps')
    //const response = fetch('http://127.0.0.1:8081/mqtt')
    .then(function (response){
    return response.text()})
    .then(data=>{
 // console.log(data)
    const myObj = JSON.parse(data)
   var dataArray = Array.from(myObj.temps);
   var dataArray2 = [];
       dataArray2.push( ['ANO', 'TEMP']);

   for (var i in dataArray2){

    dataArray2.push([dataArray[i].ano, (dataArray[i].temperatura)]);
  }
   
    const dados_graf = {
      chart: null,
    
      data2 : dataArray2,
      element: '#graph_ano',
      options  : {
        'title' : 'Temperatura X Ano',
        'width' : 400,
        'height': 300
      }
    }
    dados_graf.chart = new google.visualization.LineChart(
      document.querySelector(dados_graf.element));
   
    dados_graf.chart.draw(
      google.visualization.arrayToDataTable(dados_graf.data2),
      dados_graf.options
      )
  })
}

 function draw_table(){
	//Obtem dados do banco de dados
		const options = {method: 'GET',	mode: 'cors',cache: 'default'}
		fetch('https://polar-beyond-82520.herokuapp.com/temps')
		.then(function (response){
			return response.text()})
		.then(data=>{
		const myObj = JSON.parse(data)

	  let table = document.getElementById('mytable');
	
	  for (var k in myObj.temps)
  {
	//	  for (const [key, value] of Object.entries (myObj.temps[k])) 
      {

			var tr = table.insertRow();
			var td_local = tr.insertCell();
			var td_temperatura = tr.insertCell();
			var td_dia = tr.insertCell();
			var td_mes = tr.insertCell();
			var td_ano = tr.insertCell();

			td_local.innerHTML = myObj.temps[k].local
			td_temperatura.innerHTML = myObj.temps[k].temperatura
			td_dia.innerHTML = myObj.temps[k].dia
			td_mes.innerHTML = myObj.temps[k].mes
			td_ano.innerHTML = myObj.temps[k].ano
			
	    //  console.log(`${key}: ${value}`);
	  
   // `<tr> <td> ${myObj.temps[k].local}</td> <td>${myObj.temps[k].temperatura}</td> <td>${myObj.temps[k].dia}</td> <td>${myObj.temps[k].mes}</td> <td>${myObj.temps[k].ano}</td> <tr>`

	    //console.log(i + " - " + myObj.temps[i].temperatura)
    	//table.innerHTML += row;  
    }
  }
  
})

}

var texto = "janeiro";

var select = document.querySelector("#grafico");

for(var i=0; i < select.option.length; i++){

  if(select.option[i].text == texto){
    select.selectedIndex = i;
    break; 
  }

}

