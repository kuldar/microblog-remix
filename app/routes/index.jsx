import { redirect } from "@remix-run/node";

import { getSessionUserId } from "~/session.server";

// Loader
export const loader = async ({ request }) => {
  const sessionUserId = await getSessionUserId(request);

  // Redirect users to /posts page
  // and guests to /explore page
  return sessionUserId ? redirect("/posts") : redirect("/explore");
};
