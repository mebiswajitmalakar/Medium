import {z} from "zod"
import status from "../utils/statusCodes"
import checkPassword from "../utils/passwordCheck";
import {genSalt, hash} from "bcryptjs"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";


// middleware to validate user input
export async function inputValidationMiddleware(c: any, next: any) {
  const body = await c.req.json();

  const signupSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(8).refine((password: string) => checkPassword(password)),
    confirm_password: z.string().min(8).refine((password: string) => checkPassword(password)),
    bio: z.string().min(1).optional(),
    first_name: z.string().min(1),
    last_name: z.string().min(1).optional(),
    gender: z.string().min(1),
    date_of_birth: z.string().min(1).date(),
    country: z.string().min(1)
  })

  const zodRes = signupSchema.safeParse(body);

  if (body.confirm_password != body.password) {
    return c.json({
      message: "invalid inputs",
    }, status.bad_request);
  }

  if (!zodRes.success) {
    return c.json({
      message: "invalid inputs",
    }, status.bad_request);
  }  

  await next();
}


// middleware to encrypt the password
export async function passwordEncryptionMiddleware(c: any, next: any) {
  const body = await c.req.json();

  const salt = await genSalt(10);
  const hashedPassword = await hash(body.password, salt);

  body.password =  hashedPassword;
  
  await next()
}


// middleware to add authenticated user to database
export async function addUserMiddleware(c: any, next: any) {
  const body = await c.req.json();
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  
  let user;
  try {
    user = await prisma.users.create({
      data: {
        username: body.username,
        password:  body.password,
        bio: body.bio,
        first_name: body.first_name,
        last_name: body.last_name,
        gender: body.gender,
        date_of_birth: body.date_of_birth,
        country: body.country,
      }
    })
  }
  catch(err) {
    return c.json({
      message: "username is taken",
    }, status.bad_request);
  }

  await next()
}


// middleware to generate a JWT token
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