import {userRegister,adminRegister,login,logout,forgotPassword,resetPassword} from "../controllers/auth.controller.js"
import {validateBody} from "../middlewares/validate.middleware.js"
import {userRegisterSchema,adminRegisterSchema,loginSchema} from "../validators/auth.validate.js"
import express from "express"
const router = express.Router()

router.post("/auth/user-register",validateBody(userRegisterSchema),userRegister)

router.post("/auth/admin-register",validateBody(adminRegisterSchema),adminRegister)

router.post("/auth/login",validateBody(loginSchema),login)

router.post("/auth/logout",logout)

router.post("/auth/forgot-password",forgotPassword)

router.post("/auth/reset-password/:token",resetPassword)
export default router