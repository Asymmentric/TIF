const joi = require('joi')

exports.validatorSignUp = (req, res, next) => {
    const joiSchema = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "any.required": "Name is required",
                "string.min": "Name should be at least 2 characters",
                "string.empty": "Name should be at least 2 characters"
            }),
        email: joi.string()
            .email()
            .required()
            .messages({
                "any.required": "Email is required",
                "string.email": "Please provide a valid email address."

            }),
        password: joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required()
            .messages({
                "string.pattern.base": "Password should be atleast 2 characters",
                "any.required": "Password is required"
            })
    }).options({ abortEarly: false })

    const validation = joiSchema.validate(req.body)

    if (validation.error) {

        console.log(validation.error.details)
        const errors = validation.error.details.map(err => ({
            param: err.context.key,
            message: err.message,
            code: 'INVALID_INPUT'
        }))
        res.status(400).send({
            status: false,
            errors: errors
        })
    }
    else next()
}

exports.validatorSignIn = (req, res, next) => {
    const joiSchema = joi.object({
        email: joi.string()
            .email()
            .required()
            .messages({
                "any.required": "Email is required",
                "string.email": "Please provide a valid email address."

            }),
        password: joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required()
            .messages({
                "string.pattern.base": "Password should be atleast 2 characters",
                "any.required": "Password is required"
            })
    }).options({ abortEarly: false })

    const validation = joiSchema.validate(req.body)

    if (validation.error) {

        console.log(validation.error.details)
        const errors = validation.error.details.map(err => ({
            param: err.context.key,
            message: err.message,
            code: 'INVALID_INPUT'
        }))
        res.status(400).send({
            status: false,
            errors: errors
        })
    }
    else next()
}