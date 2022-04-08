import { redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";

// Loader
export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/posts");
  } else {
    return redirect("/explore");
  }
};
