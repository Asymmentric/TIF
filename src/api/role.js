const { createNewRole, getRoles } = require("../models/dbFunctions/dbRole")

exports.createRole = (req, res) => {
    const { name } = req.body
    createNewRole(name)
        .then(result => {


            res.status(201).send({
                status: true,
                content: {
                    data: result
                }
            })

        })
        .catch(err => {
            console.log(err)
            res.status(400).send({
                status:false,
                errors:[err]
            })
        })
}

exports.getAllRoles = (req, res) => {

    const pageNumber = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    getRoles(limit, pageNumber)
        .then(result => {

            console.log(result)
            res.status(200).send({
                status: true,
                content: result
            })

        })
        .catch(err => {

            console.error(err)
            res.status(502).send({status:false,msg:`Couldn't fetch roles. Please try again later.`})

        })
}