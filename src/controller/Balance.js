import db from "../config/database.js";
import { entrysAndOutputsSchema } from "../schemas/schema.js";
import dayjs from "dayjs";

export async function addHistoric(req, res) {
    //const { authorization } = req.headers
    const historicData = req.body
    /*const token = authorization?.replace('Bearer ', '')

    if (!token) return res.sendStatus(401)

    const session = await db.collection("sessions").findOne({ token })

    if (!session) {
        return res.sendStatus(401)
    }

    const user = await db.collection("users").findOne({
        _id: session.userId
    })

    if (!user) {
        return res.sendStatus(401)
    }*/

    const user = res.locals.usuario
    const token = res.locals.token

    try {
        await db.collection("historic").insertOne({
            userId: user._id,
            value: historicData.value,
            description: historicData.description,
            type: historicData.type,
            day: dayjs().format('DD'),
            month: dayjs().format('MM'),
            token: token
        })
        res.sendStatus(201)
    } catch {
        return res.sendStatus(500)
    }
}

export async function getHistoric (req, res) {
    /*const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')

    if (!token) return res.sendStatus(401)

    const session = await db.collection("sessions").findOne({ token })

    if (!session) {
        return res.sendStatus(401)
    }

    const user = await db.collection("users").findOne({
        _id: session.userId
    })

    if (!user) {
        return res.sendStatus(401)
    }*/
    const session = res.locals.sessao

    try {
        const historicList = await db.collection("historic").find({userId: session.userId}).toArray()
        return res.send([...historicList])
    } catch {

    }
}