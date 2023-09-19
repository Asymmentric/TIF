const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const privateKey = process.env.JWT_SECRET

exports.generateToken = (payload) => {
    return jwt.sign(payload,privateKey,{
        algorithm:'HS512',
        expiresIn:'7d'
    })
}

