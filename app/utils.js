import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 */
export function useMatchesData(id) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
