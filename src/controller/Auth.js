import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import db from "../config/database.js"
import { userSignUpSchema, userLoginSchema } from "../schemas/schema.js"

export async function signUp(req, res) {
    const userData = req.body

    const passwordHash = bcrypt.hashSync(userData.password, 10)

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
}

export async function getSignUp(req, res) {
    const usersList = await db.collection("users").find().toArray()
    try {
        return res.send(usersList)
    } catch {
        return res.sendStatus(500).send(err.message)
    }
}

export async function signIn (req, res) {
    const userLogin = req.body

    const user = await db.collection("users").findOne({email: userLogin.email})

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
}

export async function getSignIn (req, res) {
    /*const { authorization } = req.headers
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
    }*/

    const session = res.locals.sessao

    const sessionsList = await db.collection("sessions").find().toArray()

    try {
        return res.send(session)
    } catch {
        return res.sendStatus(500).send(err.message)
    }
}