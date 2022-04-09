import { json } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

import { getLatestPosts } from "~/models/post.server";
import { getSessionUserId } from "~/session.server";

// Loader
export const loader = async ({ request }) => {
  const userId = await getSessionUserId(request);
  const posts = await getLatestPosts({ userId });
  return json({ posts });
};

// Explore Page
export default function ExplorePage() {
  return (
    <>
      <div className="flex flex-shrink-0 items-center border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="text-xl font-bold leading-tight">Explore</div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 dark:border-gray-800">
        <NavLink
          to="/explore"
          end
          className={({ isActive }) =>
            `${
              isActive
                ? "border-b-4 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-black dark:hover:text-gray-400"
            } py-3 font-bold transition-colors`
          }
        >
          Latest Posts
        </NavLink>
        <NavLink
          to="/explore/users"
          className={({ isActive }) =>
            `${
              isActive
                ? "border-b-4 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-black dark:hover:text-gray-400"
            } py-3 font-bold transition-colors`
          }
        >
          Latest Users
        </NavLink>
      </div>

      <div className="overflow-y-auto">
        <Outlet />
      </div>
    </>
  );
}
