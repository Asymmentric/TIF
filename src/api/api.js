const { signInUser } = require("../models/dbFunctions/dbUser")
const { createCommunity, getAllCommunities, getAllOwnedCommunities, getAllCommunityMembers, getAllJoinedCommunities } = require("./community")
const { addMember, removeMember } = require("./member")
const { authVerifyToken } = require("./middlewares")
const { createRole, getAllRoles } = require("./role")
const { authSignUp, authSignIn, authGetUser } = require("./user")
const { validatorCreateCommunity } = require("./validators/communityValidators")
const { validatorCreateRole } = require("./validators/roleValidators")
const { validatorSignUp, validatorSignIn } = require("./validators/userValidators")

exports.router = (app) => {

    app.get('/', (req, res) => {
        console.log(req.body)
        res.send({ status: 'OK' })
    })


    //role
    app.post('/v1/role', validatorCreateRole, createRole)

    app.get('/v1/role', getAllRoles)


    //user
    app.post('/v1/auth/signup', validatorSignUp, authSignUp)

    app.post('/v1/auth/signin', validatorSignIn, authSignIn)

    app.get('/v1/auth/me', authVerifyToken, authGetUser)


    //community
    app.post('/v1/community', validatorCreateCommunity, authVerifyToken, createCommunity)

    app.get('/v1/community', getAllCommunities)

    app.get('/v1/community/:id/members',getAllCommunityMembers)

    app.get('/v1/community/me/owner', authVerifyToken, getAllOwnedCommunities)

    app.get('/v1/community/me/member', authVerifyToken, getAllJoinedCommunities)
    
    
    //member
    app.post('/v1/member',authVerifyToken,addMember)

    app.delete('/v1/member/:id',authVerifyToken,removeMember)
}