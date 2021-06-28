const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    markdown:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    hits:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('Blog',articleSchema);