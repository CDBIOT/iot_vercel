if(process.env.NODE_ENV == "production"){

//     module.exports = 
//    {
    const MONGODB_URI = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.mvho6.mongodb.net/'
    +process.env.DB_NAME+'?retryWrites=true&w=majority'
    //},
  // {
   // useNewUrlParser: true,
    //useUnifiedTopology: true
  //  },
 //   }

module.exports = {MONGODB_URI: "mongodb+srv://cdb:abcdeF12345@cluster0.mvho6.mongodb.net/equipamentos"},
//module.exports = {URI: "https://polar-beyond-82520.herokuapp.com/"},
{
useNewUrlParser: true,
useUnifiedTopology: true
}
}else{
module.exports ={MONGODB_URI:"mongodb://localhost/equipamentos"},
//module.exports ={URI: "http://127.0.0.1:8081/temps"}
{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
}


