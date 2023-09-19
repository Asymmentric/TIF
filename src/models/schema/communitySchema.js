const mongoose=require('mongoose')

const communitySchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    slug:{
        type:String,
        unique:true
    },
    owner:{
        type:String,
        required:true,
        ref:'user'
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    updated_at:{
        type:Date,
        default:Date.now
    }

})

exports.community=mongoose.model('community',communitySchema)