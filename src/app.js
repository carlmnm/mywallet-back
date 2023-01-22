import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { userSignUpSchema, userLoginSchema, entrysAndOutputsSchema } from "../schemas/schema.js";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import dayjs from "dayjs";
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
const PORT = 5001

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;

try {
    await mongoClient.connect()
    db = mongoClient.db()
} catch (err) {
    console.log('vish... algo deu errado')
}

app.post('/signup', async (req, res) => {
    const userData = req.body

    const passwordHash = bcrypt.hashSync(userData.password, 10)

    const validation = userSignUpSchema.validate(userData)
    if (validation.error) {
        return res.sendStatus(422)
    }

    const userExists = await db.collection("users").findOne({ email: userData.email })
    if (userExists) return res.sendStatus(409)

    try {
        await db.collection("users").insertOne({
            name: userData.name,
            email: userData.email,
            password: passwordHash
        })
        return res.sendStatus(201)
    } catch (err) {
        return res.sendStatus(500).send(err.message)
    }
})

app.get('/signup', async (req, res) => {
    const usersList = await db.collection("users").find().toArray()
    try {
        return res.send(usersList)
    } catch {
        return res.sendStatus(500).send(err.message)
    }
})

app.post('/signin', async (req, res) => {
    //const { email, password } = req.body
    const userLogin = req.body

    const user = await db.collection("users").findOne({email: userLogin.email})

    const validation = userLoginSchema.validate(userLogin)
    if (validation.error) {
        return res.sendStatus(422)
    }

    try {
        if (!user || !bcrypt.compareSync(userLogin.password, user.password)) {
            return res.sendStatus(422)
        }
        const token = uuid()
        //console.log(token)
        await db.collection("sessions").insertOne({
            userId: user._id,
            name: user.name,
            token: token
        })
        res.send(token)
        //console.log(`esse é seu token: ${token}`);

    } catch {
        return res.sendStatus(404)
    }

})

app.get('/signin', async (req, res) => {
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')
    //console.log(token)

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
    }

    const sessionsList = await db.collection("sessions").find().toArray()

    try {
        return res.send(session)
    } catch {
        return res.sendStatus(500).send(err.message)
    }

})

app.post('/in-and-out', async (req, res) => {
    const { authorization } = req.headers
    const historicData = req.body
    const token = authorization?.replace('Bearer ', '')

    const validation = entrysAndOutputsSchema.validate(historicData)
    if (validation.error) {
        return res.sendStatus(422)
    }

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
    }

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
})

app.get('/in-and-out', async (req, res) => {
    const { authorization } = req.headers
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
    }

    try {
        const historicList = await db.collection("historic").find({userId: session.userId}).toArray()
        return res.send([...historicList])
    } catch {

    }
})

app.listen(PORT, () => console.log(`Este servidor roda na porta: ${PORT}`))