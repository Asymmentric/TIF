const mongoose=require('mongoose')

const memberSchema=mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    community:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

exports.member=mongoose.model('member',memberSchema)