import Joi from "joi"

const userSignUpSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().min(1).required(),
    password: Joi.string().min(1).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
})

const userLoginSchema = Joi.object({
    email: Joi.string().email().min(1).required(),
    password: Joi.string().min(1).required()
})

const entrysAndOutputsSchema = Joi.object({
    value: Joi.number().min(1).required(),
    description: Joi.string().min(1).required(),
    type: Joi.string().min(1).required()
})

export { userSignUpSchema, entrysAndOutputsSchema, userLoginSchema }