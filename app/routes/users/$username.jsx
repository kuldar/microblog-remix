import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getUserByUsername } from "~/models/user.server";
import { useUser } from "~/utils";
import Sidebar from "~/components/Sidebar";
import { ArrowLeftIcon } from "~/components/Icons";

export const loader = async ({ request, params }) => {
  invariant(params.username, "username not found");

  const user = await getUserByUsername(params.username);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ user });
};

export default function UserPage() {
  const data = useLoaderData();
  const user = useUser();

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex mx-auto">
        <Sidebar />

        <main className="flex w-[600px] flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="flex items-center flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <Link to="/" className="flex items-center justify-center w-8 h-8">
              <ArrowLeftIcon />
            </Link>

            <div className="ml-3">
              <div className="text-xl font-bold leading-tight">
                {data.user.name}
              </div>
              <div className="text-sm leading-tight text-gray-500">
                12 posts
              </div>
            </div>
          </div>

          <div className="overflow-y-auto">
            {/* Cover & Avatar */}
            <div>
              <img
                className="object-cover w-full h-52"
                src={data.user.coverUrl}
                alt="#"
              />

              <div className="flex justify-between p-4">
                <img
                  className="w-32 h-32 -mt-20 border-4 border-white rounded-full dark:border-black"
                  src={data.user.avatarUrl}
                  alt="#"
                />
                <div>
                  {user.id === data.user.id && (
                    <Link
                      to="/settings"
                      className="block px-4 py-2 font-bold transition-colors bg-transparent border border-gray-300 rounded-full hover:border-red-300 hover:bg-red-100/50 hover:text-red-500 dark:border-gray-600 dark:hover:border-red-800 dark:hover:bg-transparent"
                    >
                      Edit
                    </Link>
                  )}
                  {user.id !== data.user.id && (
                    <form method="put" action="/api/follow">
                      <input
                        type="hidden"
                        name="user_id"
                        value={data.user.id}
                      />
                      <button className="block px-4 py-2 font-bold text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600">
                        Follow
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="px-4">
              <div className="mb-2">
                <div className="text-xl font-bold leading-tight">
                  {data.user.name}
                </div>
                <div className="flex">
                  <div className="leading-tight text-gray-500">
                    @{data.user.username}
                  </div>

                  <div className="ml-2 rounded bg-gray-200 px-1.5 text-sm text-gray-500 dark:bg-gray-800">
                    Follows you
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-2">{data.user.bio}</div>

              {/* Info */}
              <div className="flex mb-2 space-x-3">
                <div className="flex items-center space-x-1 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  <div>{data.user.location}</div>
                </div>

                <Link
                  to={data.user.website}
                  className="flex items-center space-x-1 text-gray-500 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-blue-500 group-hover:underline">
                    {data.user.website}
                  </div>
                </Link>

                <div className="flex items-center space-x-1 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    />
                  </svg>
                  <div>Joined January 2022</div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex mb-4 space-x-4">
                <Link to="following" className="flex space-x-2 group">
                  <div className="font-bold">15</div>
                  <div className="text-gray-500 group-hover:underline">
                    Following
                  </div>
                </Link>
                <Link to="followers" className="flex space-x-2 group">
                  <div className="font-bold">12</div>
                  <div className="text-gray-500 group-hover:underline">
                    Followers
                  </div>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-around border-b border-gray-200 dark:border-gray-800">
              <Link
                to="."
                className="pb-3 font-bold text-blue-500 border-b-4 border-blue-500"
              >
                Tweets
              </Link>
              <Link
                to="posts"
                className="pb-3 font-bold text-gray-500 transition-colors hover:text-black dark:hover:text-gray-400"
              >
                Tweets & replies
              </Link>
              <Link
                to="likes"
                className="pb-3 font-bold text-gray-500 transition-colors hover:text-black dark:hover:text-gray-400"
              >
                Likes
              </Link>
            </div>

            {/* Feed */}
            <div>post</div>
          </div>
        </main>
      </div>
    </div>
  );
}
