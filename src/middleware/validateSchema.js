export function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body)
        if (validation.error) {
            const errorMessages = error.details.map(err => err.message)
            return res.sendStatus(422).send(errorMessages)
        }
        next()
    }
}