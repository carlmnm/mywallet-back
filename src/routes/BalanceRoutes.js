import { addHistoric, getHistoric } from "../controller/Balance.js";
import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import { entrysAndOutputsSchema } from "../schemas/schema.js"
import { authValidation } from "../middleware/AuthMiddleware.js";

const balanceRouter = Router()

balanceRouter.use(authValidation)
balanceRouter.post("/in-and-out", validateSchema(entrysAndOutputsSchema), addHistoric)
balanceRouter.get("/in-and-out", getHistoric)

export default balanceRouter