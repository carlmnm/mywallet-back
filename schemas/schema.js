import Joi from "joi"

const userSignUpSchema = Joi.object({
    name: Joi.string().min(1).required(),
    CPF: Joi.string().min(1).max(11).required(),
    email: Joi.string().email().min(1).required(),
    password: Joi.string().min(1).required()
})

export { userSignUpSchema }