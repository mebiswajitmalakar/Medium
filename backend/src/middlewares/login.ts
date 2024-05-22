import {z} from "zod";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compare } from "bcryptjs";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import checkPassword from "../utils/passwordCheck";
import status from "../utils/statusCodes";

export async function inputValidationMiddleware(c: any, next: any) {
  const body = await c.req.json();

  const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(8).refine((password: string) => checkPassword(password)),
  })

  const zodRes = loginSchema.safeParse(body);

  if (!zodRes.success) {
    return c.json({
      message: "invalid inputs",
    }, status.bad_request);
  }

  await next();
}

export async function passwordCheckMiddleware(c: any, next: any) {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  const user = await prisma.users.findUnique({
      where: {
        username: body.username,
      },
      select: {
        password: true,
        first_name: true
      }
  });
  
  if (!user) {
    return c.json({
      message: "username not found",
    }, status.bad_request);
  }

  const isValidPassword = await compare(body.password, user.password);

  if (!isValidPassword) {
    return c.json({
      message: "incorrect password",
    }, status.bad_request);
  }

  body.first_name = user.first_name;

  await next();
}

export async function generateTokenMiddleware(c: any, next: any) {
  const body = await c.req.json();

  const timestamp = Math.floor(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const token = await sign({
    sub: body.username,
    name: body.first_name,
    exp: timestamp
  }, c.env.JWT_secret, c.env.JWT_algorithm);

  setCookie(c, "token", token, {
    httpOnly: true,
    path: "/",
    expires: new Date(timestamp),
    sameSite: "Lax",
  });

  await next()
}