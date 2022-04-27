import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  useNavigate,
  useTransition,
  useLoaderData,
} from "@remix-run/react";

import { updateUser, deleteUser, getUserSettings } from "~/models/user.server";
import { requireSessionUserId } from "~/session.server";
import { ArrowLeftIcon } from "~/components/Icons";
import { uploadAvatar, uploadCover } from "~/utils/cloudinary";

export const loader = async ({ request }) => {
  const userId = await requireSessionUserId(request);
  const user = await getUserSettings({ id: userId });
  return json({ user });
};

export const action = async ({ request }) => {
  const userId = await requireSessionUserId(request);

  const uploadHandler = async ({ name, stream, filename }) => {
    if (name === "avatar" && filename !== "") {
      const avatar = await uploadAvatar(stream);
      return avatar.secure_url;
    }

    if (name === "cover" && filename !== "") {
      const cover = await uploadCover(stream);
      return cover.secure_url;
    }

    stream.resume();
    return;
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "delete") {
    return await deleteUser({ userId });
  }

  if (_action === "delete-avatar") {
    return await updateUser({ id: userId, avatarUrl: null });
  }

  if (_action === "delete-cover") {
    return await updateUser({ id: userId, coverUrl: null });
  }

  if (_action === "update") {
    // URL prefixing
    if (values.website !== "" && !/^https?:\/\//i.test(values.website)) {
      values.website = "http://" + values.website;
    }

    const userUpdates = {
      id: userId,
      name: values.name,
      bio: values.bio,
      location: values.location,
      website: values.website,
      avatarUrl: values.avatar,
      coverUrl: values.cover,
    };

    const user = await updateUser(userUpdates);

    return redirect(`/users/${user.username}`);
  }
};

export default function SettingsPage() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const transition = useTransition();

  const isSubmitting = transition.state === "submitting";

  return (
    <>
      {/* Top */}
      <div className="flex items-center flex-shrink-0 px-4 py-3 text-xl font-bold border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8"
        >
          <ArrowLeftIcon />
        </button>

        <div className="flex-1 ml-4 text-xl font-bold leading-tight">
          Settings
        </div>

        <Form action="/logout" method="post">
          <button
            type="submit"
            className="block px-4 py-2 text-sm font-bold leading-snug text-center transition-colors bg-transparent border border-gray-300 rounded-full hover:border-red-300 hover:bg-red-100/50 hover:text-red-500 dark:border-gray-600 dark:hover:border-red-800 dark:hover:bg-transparent"
          >
            Logout
          </button>
        </Form>
      </div>

      <div className="overflow-y-auto">
        <Form
          id="userInfo"
          method="post"
          encType="multipart/form-data"
          className=""
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {user.avatarUrl ? (
                <img
                  className="flex-shrink-0 object-cover w-20 h-20 bg-gray-100 rounded-full"
                  src={user.avatarUrl}
                  alt={user.name || user.username}
                />
              ) : (
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-900" />
              )}

              <div className="flex-1">
                <span className="font-semibold">Avatar</span>

                <div className="flex items-center space-x-3">
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="flex-1 p-2 text-sm leading-snug text-center transition-colors bg-transparent border border-gray-300 rounded-full cursor-pointer file:mr-2 file:cursor-pointer file:rounded-full file:border-0 file:bg-gray-500 file:px-3 file:py-1 file:font-semibold file:text-gray-100 file:transition-colors hover:border-gray-400 file:hover:bg-gray-900 dark:border-gray-600"
                  />
                  <button
                    form="actionForm"
                    type="submit"
                    name="_action"
                    value="delete-avatar"
                    className="block px-4 py-2 text-sm font-bold leading-snug text-center transition-colors bg-transparent border border-gray-300 rounded-full cursor-pointer hover:border-red-300 hover:bg-red-100/50 hover:text-red-500 dark:border-gray-600 dark:hover:border-red-800 dark:hover:bg-transparent"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2 border-b border-gray-200">
            <span className="font-semibold">Cover</span>
            {user.coverUrl && (
              <img
                className="flex-shrink-0 object-cover w-full h-40 bg-gray-100 rounded-md"
                src={user.coverUrl}
                alt="Cover"
              />
            )}

            <div className="flex items-center space-x-3">
              <input
                id="cover"
                name="cover"
                type="file"
                accept="image/*"
                className="flex-1 p-2 text-sm leading-snug text-center transition-colors bg-transparent border border-gray-300 rounded-full cursor-pointer file:mr-2 file:cursor-pointer file:rounded-full file:border-0 file:bg-gray-500 file:px-3 file:py-1 file:font-semibold file:text-gray-100 file:transition-colors hover:border-gray-400 file:hover:bg-gray-900 dark:border-gray-600"
              />
              <button
                form="actionForm"
                type="submit"
                name="_action"
                value="delete-cover"
                className="block px-4 py-2 text-sm font-bold leading-snug text-center transition-colors bg-transparent border border-gray-300 rounded-full cursor-pointer hover:border-red-300 hover:bg-red-100/50 hover:text-red-500 dark:border-gray-600 dark:hover:border-red-800 dark:hover:bg-transparent"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Name */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={user.name}
                className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="bio" className="font-semibold">
                Bio
              </label>

              <input
                id="bio"
                name="bio"
                type="text"
                autoComplete="bio"
                defaultValue={user.bio}
                className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
              />
            </div>

            <div className="flex space-x-4">
              {/* Location */}
              <div className="flex flex-col flex-1 space-y-2">
                <label htmlFor="location" className="font-semibold">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="location"
                  defaultValue={user.location}
                  className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
                />
              </div>

              {/* Website */}
              <div className="flex flex-col flex-1 space-y-2">
                <label htmlFor="website" className="font-semibold">
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  autoComplete="website"
                  defaultValue={user.website}
                  className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
                />
              </div>
            </div>
          </div>
        </Form>

        <div className="flex justify-between px-4">
          {isSubmitting ? (
            <button
              disabled
              className="px-4 py-2 text-sm font-bold leading-snug text-center text-white transition-colors bg-blue-300 rounded-full"
            >
              Saving..
            </button>
          ) : (
            <button
              form="userInfo"
              type="submit"
              name="_action"
              value="update"
              className="px-4 py-2 text-sm font-bold leading-snug text-center text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Save
            </button>
          )}
          <button
            form="actionForm"
            type="submit"
            name="_action"
            value="delete"
            className="px-4 py-2 text-sm font-bold leading-snug text-center text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
          >
            Delete account
          </button>
        </div>
      </div>
      <Form id="actionForm" method="post" className="hidden"></Form>
    </>
  );
}
