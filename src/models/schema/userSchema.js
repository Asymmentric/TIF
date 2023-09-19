const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }

})

exports.user=mongoose.model('user',userSchema)