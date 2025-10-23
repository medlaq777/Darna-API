import JWT from "../utils/jwt.ts";


export const getUserFromAuthHeader = (authHeader?: string | null, extraHeaders?: Record<string, any>) => {
  const DEBUG = process.env.AUTH_DEBUG === '1' || process.env.AUTH_DEBUG === 'true';
  let tokenCandidate: string | null = null;

  const extractBearer = (value?: string | null): string | null => {
    if (!value || typeof value !== "string") return null;
    const parts = value.trim().split(" ");
    if (parts.length === 2 && parts[0]?.toLowerCase() === "bearer") {
      return parts[1] ?? null;
    }
    if (parts.length === 1) return parts[0] ?? null;
    return null;
  };

  tokenCandidate = extractBearer(authHeader);
  if (DEBUG) {
    console.log("[AUTH] Primary Authorization header present:", !!authHeader && typeof authHeader === 'string');
  }
  if (!tokenCandidate && extraHeaders) {
    const lower = (k: string) => k.toLowerCase();
    const headersLower: Record<string, any> = Object.keys(extraHeaders).reduce((acc, k) => {
      acc[lower(k)] = extraHeaders[k];
      return acc;
    }, {} as Record<string, any>);

    const viaAuth = extractBearer(headersLower["authorization"]);
    const viaJwt = extractBearer(headersLower["jwt"]);
    const viaXAccess = extractBearer(headersLower["x-access-token"]);
    tokenCandidate = viaAuth || viaJwt || viaXAccess || null;
    if (DEBUG) {
      console.log("[AUTH] Fallback headers present:", {
        authorization: !!headersLower["authorization"],
        jwt: !!headersLower["jwt"],
        xAccessToken: !!headersLower["x-access-token"]
      });
      console.log("[AUTH] Token candidate from:", viaAuth ? 'authorization' : viaJwt ? 'jwt' : viaXAccess ? 'x-access-token' : 'none');
    }
  }

  const token = tokenCandidate;
  if (!token) return null;
  try {
    const payload = JWT.verify(token) as { sub: string; email: string;[key: string]: any } | null;
    if (!payload) return null;
    if ((payload as any).pending2FA) {
      if (DEBUG) console.log("[AUTH] Rejected pending2FA token");
      return null;
    }
    if (!("sub" in payload) || typeof (payload as any).sub !== "string") {
      if (DEBUG) console.log("[AUTH] Missing or invalid sub claim in token");
      return null;
    }
    return payload;
  } catch (err) {
    if (DEBUG) console.log("[AUTH] Token verification failed:", (err as any)?.message || err);
    return null;
  }
};
