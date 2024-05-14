import { Hono } from 'hono'
import auth from "./routes/auth"

type Bindings = {
  DATABASE_URL: string
  JWT_secret: string
  JWT_algorithm: string
}
const app = new Hono<{
  Bindings: Bindings
}>()

app.route("/auth", auth)

export default app
