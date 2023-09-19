const mongoose=require('mongoose')

const roleSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        unique:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    updated_at:{
        type:Date,
        default:Date.now
    },

})

exports.role=mongoose.model('role',roleSchema)