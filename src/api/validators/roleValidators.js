const joi = require('joi')

exports.validatorCreateRole = (req, res, next) => {
    const joiSchema = joi.object({

        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty":"Name should be atleast 2 characters",
                "string.min":"Name should be atleast 2 characters"
            })

    })
        .options({ abortEarly: true })

    const data = req.body;
    let validation = joiSchema.validate(data)

    if (validation.error) {
        console.log(validation.error)
        res.status(400).send({
            status: false,
            errors: [{
                param: "name",
                message: validation.error.message,
                code: "INVALID_INPUT"
            }]
        })
    }
    else next()
}