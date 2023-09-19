const { Snowflake } = require("@theinternetfolks/snowflake")
const { community } = require("../schema/communitySchema")
const { role } = require("../schema/roleSchema")
const { member } = require("../schema/memberSchema")

exports.createNewCommunity = (communityName, communitySlug, ownerId) => {
    return new Promise((resolve, reject) => {

        const uid = Snowflake.generate()

        const newCommunity = new community({
            id: uid,
            name: communityName,
            slug: communitySlug,
            owner: ownerId
        })

        newCommunity.save()
            .then(createdCommunity => {

                const { id, name, slug, owner, created_at, updated_at } = createdCommunity

                resolve({ id, name, slug, owner, created_at, updated_at })
            })
            .catch(err => {
                console.error(err)
                reject("Some error occured with db")
            })
    })
}

exports.getCommunities = (limit, pageNumber) => {
    return new Promise((resolve, reject) => {
        let content = {}
        community.countDocuments()
            .then(totalDocs => {
                content.meta = {
                    total: totalDocs,
                    pages: totalDocs < limit ? 1 : Math.ceil(totalDocs / limit),
                    page: pageNumber
                }
                return community.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: 'id',
                            as: 'owner'
                        }
                    },
                    {
                        $unwind: '$owner'
                    }
                    , {
                        $project: {
                            _id: 0,
                            id: 1,
                            name: 1,
                            slug: 1,
                            'owner.id': 1,
                            'owner.name': 1,
                            created_at: 1,
                            updated_at: 1,

                        }
                    },
                    {
                        $skip: (pageNumber - 1) * limit
                    },
                    {
                        $limit: limit
                    }
                ])
            })
            .then(allCommunities => {

                content.data = allCommunities
                resolve(content)
            })
            .catch(err => {
                console.error(err)
                reject(`Unable to fetch communities`)
            })

    })
}

exports.getMeOwnedCommunities = (ownerId, limit, pageNumber) => {
    return new Promise((resolve, reject) => {
        let content = {}
        community.countDocuments({ owner: ownerId })
            .then(totalDocs => {
                content.meta = {
                    total: totalDocs,
                    pages: totalDocs < limit ? 1 : Math.ceil(totalDocs / limit),
                    page: pageNumber
                }
                return community.find({ owner: ownerId }, {
                    _id: 0,
                    id: 1,
                    name: 1,
                    slug: 1,
                    owner: 1,
                    created_at: 1,
                    updated_at: 1
                })
                    .skip((pageNumber - 1) * limit)
                    .limit(limit)
            })

            .then(ownedCommunities => {
                const { id, name, slug, owner, created_at, updated_at } = ownedCommunities
                content.data = ownedCommunities
                resolve(content)
            })
            .catch(err => {
                console.log(err)
                reject({ message: "Unable to fetch owned communities" })
            })

    })
}

exports.getMeJoinedCommunities=(userId,limit,pageNumber)=>{
    return new Promise((resolve, reject) => {
        let content = {}
            member.aggregate([
                {
                    $match:{user:userId}
                },
                {
                    $lookup:{
                        from:'communities',
                        localField:'community',
                        foreignField:'id',
                        as:'community'
                    }
                },
                {
                    $unwind:'$community'
                },
                {
                    $lookup:{
                        from:'users',
                        localField:"community.owner",
                        foreignField:'id',
                        as:'owner'
                    }
                },
                {
                    $unwind:'$owner'
                },
                {
                    $project:{
                        _id:0,
                        id:'$community.id',
                        name:'$community.name',
                        slug:'$community.slug',
                        owner:{
                            id:'$owner.id',
                            name:'$owner.name',
                        },
                        created_at:'$community.created_at',
                        updated_at:'$community.updated_at'
                    }
                }
            ])

            .then(ownedCommunities => {

                content.data = ownedCommunities
                resolve(content)
            })
            .catch(err => {
                console.log(err)
                reject({ message: "Unable to fetch owned communities" })
            })

    })
}


exports.communityExists=(communityId,ownerId)=>{
    return new Promise((resolve, reject) => {
        community.findOne({id:communityId})
        .then(communityDetails=>{
            if(communityDetails) {
                if(communityDetails.owner!==ownerId) throw {
                    message:"You are not authorized to perform this action",
                    code:"NOT_ALLOWED_ACCESS"
                }
                resolve(true)
            }
            else resolve(false)
        })
        .catch(err=>{
            console.error(err)
            reject(err)
        })
    })
}