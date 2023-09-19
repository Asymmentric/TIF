const { Snowflake } = require("@theinternetfolks/snowflake")
const { userExists } = require("./dbUser")
const { communityExists } = require("./dbCommunity")
const { roleExists, getRoleIdByRoleName } = require("./dbRole")
const { community } = require("../schema/communitySchema")
const { member } = require("../schema/memberSchema")

exports.addNewMember = (ownerId, communityId, userId, roleId) => {
    return new Promise((resolve, reject) => {

        communityExists(communityId, ownerId)
            .then(communityExist => {
                if (!communityExist) throw {
                    param: "community",
                    message: "Community not found.",
                    code: "RESOURCE_NOT_FOUND"
                }
                else return userExists(userId)
            })
            .then(userExist => {
                if (!userExist) throw {
                    param: "user",
                    message: "User not found.",
                    code: "RESOURCE_NOT_FOUND"
                }
                else return roleExists(roleId)
            })
            .then(roleExist => {
                if (!roleExist) throw {
                    param: "role",
                    message: "Role not found.",
                    code: "RESOURCE_NOT_FOUND"
                }
                else return this.memberExists(userId, communityId)
            })
            .then(memberExist => {
                if (memberExist) throw {
                    message: 'User is already added in the community',
                    code: "RESOURCE_EXISTS"
                }
                else {
                    const uid = Snowflake.generate()
                    const newMember = new member({
                        id: uid,
                        community: communityId,
                        user: userId,
                        role: roleId
                    })

                    return newMember.save()
                }
            })
            .then(addedMember => {
                const { id, community, user, role, created_at } = addedMember
                resolve({ id, community, user, role, created_at })
            })
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

exports.memberExists = (userId, communityId) => {
    return new Promise((resolve, reject) => {
        member.find({ user: userId, community: communityId })
            .then(memberDetail => {
                if (memberDetail.length !== 0) resolve(true)
                else resolve(false)
            })
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

exports.addOwnerMember = (ownerId, communityId) => {
    return new Promise((resolve, reject) => {
        getRoleIdByRoleName(['Community Admin'])
            .then(roleDetails => {
                console.log(roleDetails)
                return this.addNewMember(ownerId, communityId, ownerId, roleDetails.id)
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

exports.getCommunityMembers = (communitySlug, limit, pageNumber) => {
    return new Promise((resolve, reject) => {
        
        let content = {}
        let communityId = ''
        community.findOne({ slug: communitySlug })
            .then(communityDetails => {

                if (!communityDetails) throw {
                    message: "Community does not exist",
                    code: "RESOURCE_NOT_FOUND"
                }
                
                communityId = communityDetails.id
                return member.countDocuments({ community: communityDetails.id })

            })
            .then(totalDocs => {
                content.meta = {
                    total: totalDocs,
                    pages: totalDocs < limit ? 1 : Math.ceil(totalDocs / limit),
                    page: pageNumber
                }

                return member.aggregate([
                    {
                        $match: {community:communityId}
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: 'id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'role',
                            foreignField: 'id',
                            as: 'role'
                        }
                    },
                    {
                        $unwind: '$role'
                    },
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            community: 1,
                            'user.id': 1,
                            'user.name': 1,
                            'role.id': 1,
                            'role.name': 1,
                            created_at: 1
                        }
                    }
                ])
            })
            .then(result => {
                content.data = result
                resolve(content)
            })
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

exports.removeMemberFromCommunity=(adminId,membershipId)=>{
    return new Promise((resolve, reject) => {
        console.log(adminId,membershipId)
        member.findOne({id:membershipId})
        .then(isMember=>{
            if(isMember){
                return member.aggregate([
                    {
                        $match: {
                                id:membershipId
                        }
                    },
                    {
                        $lookup: {
                          from: 'members',
                          localField: 'community',
                          foreignField: 'community',
                          as: 'sameCom'
                        }
                    },{
                        $unwind:'$sameCom'
                    },
                    {
                        $match: {
                          'sameCom.user':adminId
                        }
                    },
                    {
                        $lookup: {
                          from: 'roles',
                          localField: 'sameCom.role',
                          foreignField: 'id',
                          as: 'roleInfo'
                        }
                    },{
                        $unwind:'$roleInfo'
                    },
                    {
                        $match: {
                          'roleInfo.name':{$in:['Community Admin','Community Moderator']}
                        }
                    },
                    {
                        $project: {
                          _id:0,
                          id:1,
                          community:1,
                          user:'sameCom.user',
                          scope:'roleInfo.name'
                        }
                    }
                ])
            }
            else throw {
                "message": "Member not found.",
                "code": "RESOURCE_NOT_FOUND"
              }
        })
        .then(authorized=>{
            console.log(authorized)
            resolve('q')
        })
        .catch(err=>{
            console.log(err)
            reject('n')
        })
    })
}
