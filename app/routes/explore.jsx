import { json } from "@remix-run/node";
import { useLoaderData, NavLink, Outlet } from "@remix-run/react";

import { getLatestPosts } from "~/models/post.server";
import { getUserId } from "~/session.server";

// Loader
export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  const posts = await getLatestPosts({ userId });
  return json({ posts });
};

// Explore Page
export default function ExplorePage() {
  const { posts } = useLoaderData();
  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
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
