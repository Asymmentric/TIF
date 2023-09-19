const { addNewMember } = require("../models/dbFunctions/dbMember")
const { removeMemberFromCommunity } = require("../models/dbFunctions/dbMember")
const { community } = require("../models/schema/communitySchema")

exports.addMember=(req,res)=>{
    const {community,user,role}=req.body

    addNewMember(req.tokenData.id,community,user,role)
    .then(result=>{
        console.log(result)
        res.status(201).send({
            status:true,
            content:{
                data:result
            }
        })
    })
    .catch(err=>{
        res.status(400).send({
            status:false,
            errors:[err]
        })
    })
}

exports.removeMember=(req,res)=>{

    const {id}=req.params
    if(id){
        removeMemberFromCommunity(req.tokenData.id, id)
        .then(result=>{
            console.log(result)
            res.status(200).send({
                status:true,
            })
        })
        .catch(err=>{
            res.status(400).send({status:false})
        })
    }
    
}