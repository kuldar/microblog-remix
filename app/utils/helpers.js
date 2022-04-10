import { useMemo } from "react";
import { useMatches } from "@remix-run/react";

// Search across all loader data
export function useMatchesData(id) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

// Get optional user from loader data
export function useOptionalUser() {
  const data = useMatchesData("root");
  const isUser = (user) =>
    user && typeof user === "object" && typeof user.email === "string";
  if (!data || !isUser(data.user)) return undefined;
  return data.user;
}

// Get required user from loader data
export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, maybe try useOptionalUser instead"
    );
  }
  return maybeUser;
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

export function formatDate(date) {
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("en-us", dateOptions);
}

export function formatTime(date) {
  const timeOptions = { hour: "numeric", minute: "numeric" };
  return new Date(date).toLocaleTimeString("en-us", timeOptions);
}
