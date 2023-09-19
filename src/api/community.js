const { createNewCommunity, getCommunities, getMeOwnedCommunities, getMeJoinedCommunities } = require("../models/dbFunctions/dbCommunity")
const { addNewMember, addOwnerMember, getCommunityMembers } = require("../models/dbFunctions/dbMember")
const { getRoleIdByRoleName } = require("../models/dbFunctions/dbRole")

exports.createCommunity = (req, res) => {
    const { name } = req.body
    const ownerId = req.tokenData.id
    const slug = this.generateSlug(name)
    let responseData = {}

    createNewCommunity(name, slug, ownerId)
        .then(result => {
            responseData = {
                status: true,
                content: {
                    data: result
                }
            }
            return addOwnerMember(ownerId, result.id)
        })
        .then(memberOneDetails => {
            console.log(memberOneDetails)
            res.status(201).send(responseData)
        })
        .catch(err => {
            console.log(err)
            res.send({ status: false, errors: [{ message: "Try Again." }] })
        })
}

exports.getAllCommunities = (req, res) => {

    const pageNumber = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    getCommunities(limit, pageNumber)
        .then(result => {

            res.status(200).send({
                status: true,
                content: result
            })

        })
        .catch(err => {

            console.error(err)
            res.status(502).send({ status: false, msg: `Couldn't fetch Communities. Please try again later.` })

        })
}

exports.getAllOwnedCommunities = (req, res) => {

    const pageNumber = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    getMeOwnedCommunities(req.tokenData.id, limit, pageNumber)
        .then(result => {
            res.status(200).send({
                status: true,
                content: result
            })
        })
        .catch(err => {
            console.error(err)
            res.status(502).send({ status: false, msg: `Couldn't fetch Communities. Please try again later.` })
        })
}

exports.getAllCommunityMembers = (req, res) => {
    const { id } = req.params
    console.log(id)
    const pageNumber = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    getCommunityMembers(id, limit, pageNumber)
        .then(result => {
            res.status(200).send({
                status: true,
                content: result
            })
        })
        .catch(err => {

            console.error(err)
            res.status(502).send({ status: false, msg: `Couldn't fetch community members. Please try again later.` })

        })
}

exports.getAllJoinedCommunities = (req, res) => {

    const pageNumber = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    getMeJoinedCommunities(req.tokenData.id, limit, pageNumber)
        .then(result => {
            res.status(200).send({
                status: true,
                content: result
            })
        })
        .catch(err => {
            console.error(err)
            res.status(502).send({ status: false, msg: `Couldn't fetch Communities. Please try again later.` })
        })

}

exports.generateSlug = (communityName) => {
    return communityName.toLowerCase()
}