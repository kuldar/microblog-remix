import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

/**
 * This base hook is used in other hooks
 * to quickly search for specific data
 * across all loader data, using useMatches.
 */
export function useMatchesData(id) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

// Is User
function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}

// Use Optional User
export function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

// Use User
export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

// Validate Email
export function validateEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

// Format Time Ago
export function formatTimeago(date) {
  const then = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 30) {
    return `${days}d`;
  } else {
    return then.toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
    });
  }
}
