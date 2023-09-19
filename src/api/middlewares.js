const { verifyToken } = require("../utils/jwt")
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config()

const privateKey=process.env.JWT_SECRET

exports.authVerifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) throw {message:"You need to sign in to proceed.",code:"NOT_SIGNEDIN"}
        let data=jwt.verify(token,privateKey)
        
        if (data) {
            req.tokenData = data;
            next()
        }
        
    } catch (error) {
        console.log(error)
        res.status(403).send({ status: false, errors:[{message:"You need to sign in to proceed.",code:"NOT_SIGNEDIN"}] })
    }
}