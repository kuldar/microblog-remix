import { Form, useNavigate } from "@remix-run/react";

import { useUser } from "~/utils/helpers";
import { updateUser, deleteUser } from "~/models/user.server";
import { requireSessionUserId } from "~/session.server";
import { ArrowLeftIcon } from "~/components/Icons";

export const loader = async ({ request }) => {
  return await requireSessionUserId(request);
};

export const action = async ({ request }) => {
  const userId = await requireSessionUserId(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

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
      avatarUrl: values.avatarUrl,
      coverUrl: values.coverUrl,
    };

    return await updateUser(userUpdates);
  }

  if (_action === "delete") {
    return await deleteUser({ userId });
  }
};

export default function SettingsPage() {
  const user = useUser();
  const navigate = useNavigate();

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
          className="flex flex-col p-4 space-y-6"
        >
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

          <div className="flex flex-col space-y-2">
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

          <div className="flex flex-col space-y-2">
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

          <div className="flex flex-col space-y-2">
            <label htmlFor="coverUrl" className="font-semibold">
              Cover Url
            </label>

            <input
              id="coverUrl"
              name="coverUrl"
              type="text"
              autoComplete="coverUrl"
              defaultValue={user.coverUrl}
              className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="avatarUrl" className="font-semibold">
              Avatar Url
            </label>

            <input
              id="avatarUrl"
              name="avatarUrl"
              type="text"
              autoComplete="avatarUrl"
              defaultValue={user.avatarUrl}
              className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
            />
          </div>
        </Form>
        <div className="flex justify-between px-4">
          <button
            form="userInfo"
            type="submit"
            name="_action"
            value="update"
            className="px-4 py-2 text-sm font-bold leading-snug text-center text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
          >
            Save
          </button>
          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="delete"
              className="px-4 py-2 text-sm font-bold leading-snug text-center text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
            >
              Delete account
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
