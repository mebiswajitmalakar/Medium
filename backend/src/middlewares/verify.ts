import { Context } from "hono";
import { verify } from "hono/jwt";
import status from "../utils/statusCodes";

export async function verifyTokenMiddleware(c: Context, next: any) {
  const auth: string | undefined = await c.req.header("authorization");

  if (!auth) {
    return c.json({
      message: "unauthorized",
    }, status.unauthorized);
  }

  const token: string = auth.split(" ")[1];

  let payload;
  try {
    payload = await verify(token, c.env.JWT_secret, c.env.JWT_algorithm);
  }
  catch(err) {
    return c.json({
      message: "unauthorized",
    }, status.unauthorized);
  }

  await next();
}