const { hash, compare } = require("bcrypt")

exports.notFoundHandler = (req, res) => {
    res.status(404).send({ status: 'Not Found' })
}

exports.hashPassword = (passwordText) => {
    return new Promise((resolve, reject) => {
        hash(passwordText, 10)
            .then(passwordHash => {
                resolve(passwordHash)
            })
            .catch(err => {
                console.error(err)
                reject(`Unable to hash password`)
            })
    })
}