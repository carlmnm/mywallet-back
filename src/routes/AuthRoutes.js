import { signUp, getSignUp, signIn, getSignIn } from "../controller/Auth.js";
import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import { userSignUpSchema, userLoginSchema } from "../schemas/schema.js"
import { authValidation } from "../middleware/AuthMiddleware.js";

const authRouter = Router()

//authRouter.use(authValidation)
authRouter.post("/signup", validateSchema(userSignUpSchema), signUp)
authRouter.get("/signup", getSignUp)
authRouter.post("/signin", validateSchema(userLoginSchema), signIn)
authRouter.get("/signin", authValidation,getSignIn)

export default authRouter