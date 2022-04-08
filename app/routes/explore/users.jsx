import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getLatestUsers } from "~/models/user.server";
import { getUserId } from "~/session.server";
import User from "~/components/User";

// Loader
export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  const users = await getLatestUsers({ userId });
  return json({ users });
};

// Explore Users Page
export default function ExploreUsersPage() {
  const { users } = useLoaderData();
  return (
    <>
      {users.map((user) => (
        <User key={user.id} user={user} />
      ))}
    </>
  );
}
