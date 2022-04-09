import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getSessionUserById } from "~/models/user.server";

// Check for session secret in environment
invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

// Create session storage cookie
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

// User session key
const USER_SESSION_KEY = "userId";

// Get session from request header cookies
export async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Get user ID from session
export async function getSessionUserId(request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

// Get session user from db
export async function getSessionUser(request) {
  const userId = await getSessionUserId(request);
  if (userId === undefined) return null;

  const user = await getSessionUserById({ id: userId });
  if (user) return user;

  throw await logout(request);
}

// Require user ID to exist in session
export async function requireSessionUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

// Create user session cookie
// and return it in redirect headers
export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

// Clear user session cookie
export async function logout(request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
