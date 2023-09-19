const joi=require('joi')

exports.validatorCreateCommunity=(req,res,next)=>{
    const joiSchema=joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "any.required": "Name is required",
                "string.min": "Name should be at least 2 characters",
                "string.empty": "Name should be at least 2 characters"
            }),
    }).options({abortEarly:false})

    const validation=joiSchema.validate(req.body)

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