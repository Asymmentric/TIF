const { createUser, signInUser, getUserById } = require("../models/dbFunctions/dbUser")
const { generateToken, verifyToken } = require("../utils/jwt")


exports.authSignUp = (req, res) => {

    const { name, email, password } = req.body

    createUser(name, email, password)
        .then(result => {

            const { id, name, email, created_at } = result


            const token = generateToken({ id, name, email })

            res.status(201).send({

                status: true,
                content: {
                    data: { id, name, email, created_at },
                    meta: { access_token: token }
                }
            })
        })
        .catch(err=>{
            console.error(err)
            res.status(400).send({
                status:false,
                errors:[err]
            })
        })
}

exports.authSignIn = (req, res) => {
    const { email, password } = req.body
    
    signInUser(email, password)
        .then(result => {
            const { id, name, email, created_at } = result

            const token = generateToken({ id, name, email })

            res.status(200).send({
                status: true,
                content: {
                    data: { id, name, email, created_at },
                    meta: { access_token: token }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).send({ status: false, errors:[err]})
        })
}

exports.authGetUser = (req, res) => {
    getUserById(req.tokenData.id)
            .then(result => {
    
                res.status(200).send({
                    status: true,
                    content: {
                        data: result
                    }
                })
            })
            .catch(err => {
                console.error(err)
                res.status(404).send({ status: false, msg: `Unable to fetch user data` })
            })
    //     }
    // }
    
    
    
        
}