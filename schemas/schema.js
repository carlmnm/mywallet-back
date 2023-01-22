import Joi from "joi"

const userSignUpSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().min(1).required(),
    password: Joi.string().min(1).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
})

export { userSignUpSchema }