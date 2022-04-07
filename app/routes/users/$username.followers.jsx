import { json } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getUserFollowers, getUserByUsername } from "~/models/user.server";
import { getUserId } from "~/session.server";
import { ArrowLeftIcon } from "~/components/Icons";
import User from "~/components/User";

// Loader
export const loader = async ({ request, params }) => {
  const userId = await getUserId(request);
  invariant(params.username, "username not found");
  const user = await getUserByUsername({ username: params.username, userId });
  const followers = await getUserFollowers({
    username: params.username,
    userId,
  });

  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ user, followers });
};

export default function UserFollowersPage() {
  const data = useLoaderData();

  return (
    <>
      {/* Top */}
      <Link
        to={`/users/${data.user.username}`}
        className="flex items-center flex-shrink-0 px-4 py-3"
      >
        <div className="flex items-center justify-center w-8 h-8">
          <ArrowLeftIcon />
        </div>

        <div className="ml-3">
          <div className="text-xl font-bold leading-tight">
            {data.user.name || data.user.username}
          </div>
          <div className="text-sm leading-tight text-gray-500">
            @{data.user.username}
          </div>
        </div>
      </Link>

      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 dark:border-gray-800">
        <NavLink
          to={`/users/${data.user.username}/followers`}
          className={({ isActive }) =>
            `${
              isActive
                ? "border-b-4 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-black dark:hover:text-gray-400"
            } py-3 font-bold transition-colors`
          }
        >
          Followers
        </NavLink>
        <NavLink
          to={`/users/${data.user.username}/following`}
          className={({ isActive }) =>
            `${
              isActive
                ? "border-b-4 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-black dark:hover:text-gray-400"
            } py-3 font-bold transition-colors`
          }
        >
          Following
        </NavLink>
      </div>

      <div className="overflow-y-auto">
        {data.followers.length === 0 ? (
          <div className="w-full pt-12 text-center text-gray-300 dark:text-gray-500">
            No followers
          </div>
        ) : (
          data.followers?.map((user) => <User key={user.id} user={user} />)
        )}
      </div>
    </>
  );
}
