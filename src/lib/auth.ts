import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const key = () => { const secret = process.env.SESSION_SECRET || (process.env.NODE_ENV !== "production" ? "development-only-secret-change-this-now-32chars" : ""); if (secret.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters."); return new TextEncoder().encode(secret); };
export async function createSession(id: string, email: string) {
  const token = await new SignJWT({ sub: id, email }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(key());
  (await cookies()).set("raveena_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
}
export async function getSession() {
  const token = (await cookies()).get("raveena_session")?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key())).payload as { sub: string; email: string }; } catch { return null; }
}
export async function clearSession() { (await cookies()).delete("raveena_session"); }
