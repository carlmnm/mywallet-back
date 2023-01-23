import express from "express"
import cors from "cors"
import authRouter from "./routes/AuthRoutes.js"
import balanceRouter from "./routes/BalanceRoutes.js"

const app = express()
app.use(express.json())
app.use(cors())
const PORT = 5001

app.use([authRouter, balanceRouter])

app.listen(PORT, () => console.log(`Este servidor roda na porta: ${PORT}`))