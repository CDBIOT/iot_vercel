
const mongoose = require('mongoose')
require('dotenv').config()

//Configuração do mongoose
//const MONGODB_URI= "mondodb://localhost:27017"
const MONGODB_URI= "mongodb+srv://cdb:abcdeF12345@cluster0.mvho6.mongodb.net/equipamentos"
mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
    
    console.log("MongodB inventário conectado com sucesso!")
})
.catch((err) => {
    console.log("Houve um erro ao se conectar ao mongodB inventário: " +err)
})

//Banco de dados equipamentos
//tabela inventario

const inventario = mongoose.model('Inventario',{
    //_id: Number,
    PATRIMONIO : Number, 
    EQUIPAMENTO: String,
    MARCA: String,
    MODELO: String,
    SERIAL: Number,
    LOCALIZACAO: String
})

module.exports = inventario

