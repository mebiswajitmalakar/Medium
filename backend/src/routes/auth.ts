import { Hono } from "hono";
import status from "../utils/statusCodes";
import { InputValidationMiddleware, passwordEncryptionMiddleware, addUserMiddleware, generateTokenMiddleware } from "../middlewares/auth";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>();

app.use("/signup", InputValidationMiddleware)

app.use("/signup", passwordEncryptionMiddleware)

app.use("/signup", addUserMiddleware)

app.use("/signup", generateTokenMiddleware)

app.post("/signup", async (c) => {
  const {jwt_token} = await c.req.json();

  return c.json({
    message: "signup successful",
    token: jwt_token
  }, status.ok)
})

export default app;