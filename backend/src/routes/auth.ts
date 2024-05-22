import { Hono } from "hono";
import status from "../utils/statusCodes";
import { 
  inputValidationMiddleware as signupInputValidation, 
  passwordEncryptionMiddleware as signupPasswordEncryption, 
  addUserMiddleware as signupAddUser, 
  generateTokenMiddleware  as signupGenerateToken
} from "../middlewares/signup";
import { 
  inputValidationMiddleware as loginInputValidation, 
  passwordCheckMiddleware as loginPasswordCheck, 
  generateTokenMiddleware as loginGenerateToken
} from "../middlewares/login";
import { verifyTokenMiddleware as verifyToken } from "../middlewares/verify";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_secret: string
    JWT_algorithm: string
  }
}>();

app.use("/signup", signupInputValidation)

app.use("/signup", signupPasswordEncryption)

app.use("/signup", signupAddUser)

app.use("/signup", signupGenerateToken)

app.use("/login", loginInputValidation)

app.use("/login", loginPasswordCheck)

app.use("/login", loginGenerateToken)

app.use("/verify", verifyToken)

app.post("/signup", async (c) => {

  return c.json({
    message: "signup successful",
  }, status.ok)
})

app.post("/login", async (c) => {

  return c.json({
    message: "login successful",
  }, status.ok)
})

app.post("/verify", async (c) => {

  return c.json({
    message: "verify successful",
  }, status.ok)
})

export default app;