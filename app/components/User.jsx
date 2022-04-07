import { Link } from "@remix-run/react";

const User = ({ user }) => {
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
          <div className="flex">
            <Link to={`/users/${user.username}`} className="group">
              <div className="font-bold group-hover:underline">
                {user.name || user.username}
              </div>
              <div className="leading-snug text-gray-500">@{user.username}</div>
            </Link>
          </div>

          {/* User bio  */}
          <div className="mt-2 space-y-2 leading-snug">{user.bio}</div>
        </div>
      </div>
    </div>
  );
};

export default User;
