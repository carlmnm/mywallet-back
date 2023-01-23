import db from "../config/database.js"

export async function authValidation(req, res, next) {
    const { authorization } = req.headers
    //const historicData = req.body
    const token = authorization?.replace('Bearer ', '')

    if (!token) return res.sendStatus(401)

    try{
    const session = await db.collection("sessions").findOne({ token })

    if (!session) {
        return res.sendStatus(401)
    }

    const user = await db.collection("users").findOne({
        _id: session.userId
    })

    if (!user) {
        return res.sendStatus(401)
    }

    res.locals.sessao = session
    res.locals.usuario = user
    res.locals.token = token

    next()
    } catch {
        res.status(500).send(error)
    }
}