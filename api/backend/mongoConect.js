
const mongoose = require('mongoose')
require('dotenv').config()

//Configuração do mongoose

//mongoose.Promise = global.Promise;
const MONGODB_URI = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
      +process.env.DB_NAME+'?retryWrites=true&w=majority'
    
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

