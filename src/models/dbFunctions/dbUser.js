const { hash, compare, compareSync } = require("bcrypt")
const { hashPassword, comparePasswords } = require("../../utils/utils")
const { user } = require("../schema/userSchema")
const { Snowflake } = require("@theinternetfolks/snowflake")

exports.createUser = (name, email, password) => {
    return new Promise((resolve, reject) => {
        this.userExists(email)
            .then(alreadyExists => {
                if (alreadyExists) throw {
                    param: 'email',
                    message: 'User with this email address already exists.',
                    code: 'RESOURCE_EXISTS'
                }
                return hash(password, 10)
            })
            .then(passwordHash => {

                const uid = Snowflake.generate()
                const newUser = new user({
                    id: uid,
                    name,
                    email,
                    password: passwordHash
                })

                return newUser.save()
            })
            .then(createdUser => {

                const { id, name, email, created_at } = createdUser

                resolve({ id, name, email, created_at })
            })
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

exports.signInUser = (email, password) => {
    return new Promise((resolve, reject) => {
        let data = {}
        user.find({ email })
            .then(result => {

                if (result.length === 0)
                    throw {
                        param: 'email',
                        message: 'User with this email address does not exists.',
                        code: 'RESOURCE_NOT_FOUND'
                    }
                const { id, name, email, created_at } = result[0]
                data = { id, name, email, created_at }
                return compare(password, result[0].password)
            })
            .then(passwordCorrect => {

                if (passwordCorrect) resolve(data)
                throw {
                    param: 'password',
                    message: 'The credentials you provided are invalid.',
                    code: 'INVALID_CREDENTIALS'
                }
            })
            .catch(err => {

                console.error(err)
                reject(err)
            })
    })
}

exports.userExists = (userIdOrEmail) => {
    return new Promise((resolve, reject) => {
        user.find({ $or: [{ email: userIdOrEmail }, { id: userIdOrEmail }] })
            .then(result => {
                if (result.length !== 0) resolve(true)
                else resolve(false)
            })
            .catch(err => {
                console.error(err)
                reject(`Error fetching user details`)
            })
    })
}

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        user.find({ id })
            .then(user => {

                const { id, name, email, created_at } = user[0]
                resolve({ id, name, email, created_at })
            })
            .catch(err => {
                console.error(err)
                reject(`Can not fetch user details`)
            })
    })
}
