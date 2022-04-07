import { json } from "@remix-run/node";
import {
  Form,
  NavLink,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { useOptionalUser } from "~/utils";
import { requireUserId, getUserId } from "~/session.server";
import {
  getUserByUsername,
  followUser,
  unfollowUser,
} from "~/models/user.server";
import {
  ArrowLeftIcon,
  LocationIcon,
  LinkIcon,
  CalendarIcon,
} from "~/components/Icons";

// Loader
export const loader = async ({ request, params }) => {
  const userId = await getUserId(request);
  invariant(params.username, "username not found");
  const user = await getUserByUsername({ username: params.username, userId });

  if (!user) throw new Response("Not Found", { status: 404 });

  return json({ user });
};

// Action
export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "follow") {
    return await followUser({ followerId: userId, followedId: values.userId });
  }

  if (_action === "unfollow") {
    return await unfollowUser({
      followerId: userId,
      followedId: values.userId,
    });
  }
};

export default function UserPage() {
  const data = useLoaderData();
  const user = useOptionalUser();
  const navigate = useNavigate();

  return (
    <>
      {/* Top */}
      <div className="flex items-center flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8"
        >
          <ArrowLeftIcon />
        </button>

        <div className="ml-3">
          <div className="text-xl font-bold leading-tight">
            {data.user.name || data.user.username}
          </div>
          <div className="text-sm leading-tight text-gray-500">
            {data.user._count.posts}
            {data.user._count.posts === 1 ? " post" : " posts"}
          </div>
        </div>
      </div>

      <div className="overflow-y-auto">
        {/* Cover & Avatar */}
        <div>
          {data.user.coverUrl ? (
            <img
              className="object-cover w-full h-52"
              src={data.user.coverUrl}
              alt="Cover"
            />
          ) : (
            <div className="w-full bg-gray-100 h-52 dark:bg-gray-900" />
          )}

          <div className="flex justify-between p-4">
            {data.user.avatarUrl ? (
              <img
                className="object-cover w-32 h-32 -mt-20 border-4 border-white rounded-full dark:border-black"
                src={data.user.avatarUrl}
                alt="Avatar"
              />
            ) : (
              <div className="w-32 h-32 -mt-20 bg-gray-100 border-4 border-white rounded-full dark:border-black dark:bg-gray-900" />
            )}
            <div>
              {user && user.id === data.user.id && (
                <Link
                  to="/settings"
                  className="block px-4 py-2 font-bold transition-colors bg-transparent border border-gray-300 rounded-full hover:border-red-300 hover:bg-red-100/50 hover:text-red-500 dark:border-gray-600 dark:hover:border-red-800 dark:hover:bg-transparent"
                >
                  Edit
                </Link>
              )}
              {user && user.id !== data.user.id && (
                <>
                  {data.user.followers?.length > 0 ? (
                    <Form method="post">
                      <input type="hidden" name="userId" value={data.user.id} />
                      <button
                        name="_action"
                        value="unfollow"
                        className="block px-4 py-2 font-bold text-blue-500 transition-colors bg-transparent border border-blue-500 rounded-full hover:border-red-500 hover:bg-red-100/50 hover:text-red-500 dark:hover:bg-transparent"
                      >
                        Unfollow
                      </button>
                    </Form>
                  ) : (
                    <Form method="post">
                      <input type="hidden" name="userId" value={data.user.id} />
                      <button
                        name="_action"
                        value="follow"
                        className="block px-4 py-2 font-bold text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                      >
                        Follow
                      </button>
                    </Form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="px-4">
          {/* Name */}
          <div className="mb-2">
            <div className="text-xl font-bold leading-tight">
              {data.user.name || data.user.username}
            </div>
            <div className="flex">
              <div className="leading-tight text-gray-500">
                @{data.user.username}
              </div>

              {data.user.followings.length > 0 && (
                <div className="ml-2 rounded bg-gray-200 px-1.5 text-sm text-gray-500 dark:bg-gray-800">
                  Follows you
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {data.user.bio && <div className="mb-2">{data.user.bio}</div>}

          {/* Info */}
          <div className="flex mb-2 space-x-3">
            {data.user.location && (
              <div className="flex items-center space-x-1 text-gray-500">
                <LocationIcon className="w-5 h-5" />
                <div>{data.user.location}</div>
              </div>
            )}

            {data.user.website && (
              <a
                href={data.user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-gray-500 group"
              >
                <LinkIcon className="w-5 h-5" />
                <div className="text-blue-500 group-hover:underline">
                  {data.user.website.replace(/^https?:\/\//, "")}
                </div>
              </a>
            )}

            <div className="flex items-center space-x-1 text-gray-500">
              <CalendarIcon className="w-5 h-5" />
              <div>
                Joined{" "}
                {new Date(data.user.createdAt).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex mb-4 space-x-4">
            <Link to="following" className="flex space-x-2 group">
              <div className="font-bold">{data.user._count.followings}</div>
              <div className="text-gray-500 group-hover:underline">
                Following
              </div>
            </Link>
            <Link to="followers" className="flex space-x-2 group">
              <div className="font-bold">{data.user._count.followers}</div>
              <div className="text-gray-500 group-hover:underline">
                Followers
              </div>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-200 dark:border-gray-800">
          <NavLink
            to="."
            end
            className={({ isActive }) =>
              `${
                isActive
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-black dark:hover:text-gray-400"
              } pb-3 font-bold transition-colors`
            }
          >
            Feed
          </NavLink>
          <NavLink
            to="posts"
            className={({ isActive }) =>
              `${
                isActive
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-black dark:hover:text-gray-400"
              } pb-3 font-bold transition-colors`
            }
          >
            Posts & replies
          </NavLink>
          <NavLink
            to="likes"
            className={({ isActive }) =>
              `${
                isActive
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-black dark:hover:text-gray-400"
              } pb-3 font-bold transition-colors`
            }
          >
            Likes
          </NavLink>
        </div>

        {/* Feed */}
        <Outlet />
      </div>
    </>
  );
}
