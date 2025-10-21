import JWT from "../utils/jwt.ts";

export const getUserFromAuthHeader = (authHeader?: string | null) => {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }
  const parts = authHeader.trim().split(" ");
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== "bearer") {
    return null;
  }
  const token = parts[1];
  if (!token) return null;
  try {
    const payload = JWT.verify(token) as { sub: string, email: string, [key: string]: any } | null;
    if (!payload) return null;
    return payload;
  } catch (err) {
    return null;
  }
};
