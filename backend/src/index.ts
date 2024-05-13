import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

type Bindings = {
  DATABASE_URL: string
}
const app = new Hono<{
  Bindings: Bindings
}>()

// TODO: place this somewhere appropriate
const prisma = new PrismaClient().$extends(withAccelerate())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
