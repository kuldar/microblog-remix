// Learn more - https://fly.io/docs/reference/configuration/#services-http_checks
import { prisma } from "~/db.server";

// Loader
export const loader = async ({ request }) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // If we can connect to the database, make a query
    // and a HEAD request to ourselves, we're good
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    // Healthcheck good
    return new Response("OK");
  } catch (error) {
    // Healthcheck failed
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
