const { Snowflake } = require("@theinternetfolks/snowflake")
const { role } = require("../schema/roleSchema")

exports.createNewRole = (roleName) => {
    return new Promise((resolve, reject) => {
        
        const uid = Snowflake.generate()

        const newRole = new role({
            id: uid,
            name: roleName
        })

        newRole.save()
            .then(createdRole => {

                const { id, name, created_at, updated_at } = createdRole
                resolve({ id, name, created_at, updated_at })

            })
            .catch(err => {

                console.error(err)
                if(err.code===11000) {
                    reject({
                        param:'role',
                        message:'Role already exists',
                        code:'RESOURCE_EXISTS'
                    })
                }
                reject('Some error occured with db')

            })
    })
}

exports.getRoles = (limit, pageNumber) => {
    return new Promise((resolve, reject) => {
        let content = {}
        role.countDocuments()

            .then(totalDocs => {

                content.meta = {
                    total   : totalDocs,
                    pages   : totalDocs<limit?1:Math.ceil(totalDocs / limit),
                    page    : pageNumber
                }

                return role.find({}, {
                    id: 1,
                    name: 1,
                    created_at: 1,
                    updated_at: 1,
                    _id: 0
                })
                    .skip((pageNumber - 1) * limit)
                    .limit(limit)
            })
            .then(allRoles => {

                content.data = allRoles
                resolve(content)
            })
            .catch(err=>{
                console.error(err)
                reject('Unable fetch roles')
            })
    })
}

exports.roleExists=(roleId)=>{
    return new Promise((resolve, reject) => {
        role.findOne({id:roleId})
        .then(roleDetails=>{
            if(roleDetails) resolve(true)
            else resolve(false)
        })
        .catch(err=>{
            console.error(err)
            reject(err)
        })
    })
}

exports.getRoleIdByRoleName=(roleNames)=>{
    return new Promise((resolve, reject) => {
        role.findOne({name:{$in:roleNames}},{_id:0,id:1,name:1})
        .then(roleDetails=>{
            resolve(roleDetails)
        })
        .catch(err=>{
            console.error(err)
            reject('Unable to fetch roles')
        })
    })
}