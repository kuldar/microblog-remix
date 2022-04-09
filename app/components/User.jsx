import { Link, useFetcher } from "@remix-run/react";

import { useOptionalUser } from "~/utils/helpers";

const User = ({ user }) => {
  const currentUser = useOptionalUser();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col px-4 pt-4 pb-3 transition-colors border-b border-gray-200 hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-800/40">
      <div className="flex">
        {/* Avatar  */}
        <Link
          to={`/users/${user.username}`}
          className="self-start flex-shrink-0 mr-4 transition-opacity hover:opacity-90"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              className="object-cover w-12 h-12 rounded-full"
              alt={user.name || user.username}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-900" />
          )}
        </Link>

        <div className="w-full">
          {/* Post header  */}
          <div className="flex items-center">
            <Link to={`/users/${user.username}`} className="flex-1 group">
              <div className="font-bold group-hover:underline">
                {user.name || user.username}
              </div>
              <div className="leading-snug text-gray-500">@{user.username}</div>
            </Link>
            {currentUser && user.id === currentUser.id && (
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm font-bold transition-colors bg-transparent border border-gray-300 rounded-full hover:border-red-300 hover:bg-red-100/50 hover:text-red-500 dark:border-gray-600 dark:hover:border-red-800 dark:hover:bg-transparent"
              >
                Edit
              </Link>
            )}
            {currentUser && user.id !== currentUser.id && (
              <>
                {user.followers?.length > 0 ? (
                  <fetcher.Form
                    method="post"
                    action={`/users/${user.username}`}
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      name="_action"
                      value="unfollow"
                      className="block px-4 py-2 text-sm font-bold text-blue-500 transition-colors bg-transparent border border-blue-500 rounded-full hover:border-red-500 hover:bg-red-100/50 hover:text-red-500 dark:hover:bg-transparent"
                    >
                      Unfollow
                    </button>
                  </fetcher.Form>
                ) : (
                  <fetcher.Form
                    method="post"
                    action={`/users/${user.username}`}
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      name="_action"
                      value="follow"
                      className="block px-4 py-2 text-sm font-bold text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                    >
                      Follow
                    </button>
                  </fetcher.Form>
                )}
              </>
            )}
          </div>

          {/* User bio  */}
          <div className="mt-2 space-y-2 leading-snug">{user.bio}</div>
        </div>
      </div>
    </div>
  );
};

export default User;
