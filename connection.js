const mongoose = require("mongoose"); 


var Connect = ()=>{
    mongoose.connect("mongodb://localhost/blog",{
    useNewUrlParser:true,
    useUnifiedTopology:true
    });

    mongoose.connection.on("error", err => {
        console.log("err", err)
    })
    
    mongoose.connection.on("connected", (err, res) => {
        console.log("mongoose is connected")
    })
}

module.exports = Connect;