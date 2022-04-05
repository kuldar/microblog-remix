// import { json } from "@remix-run/node";
// import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
// import { getNoteListItems } from "~/models/note.server";
import Sidebar from "~/components/Sidebar";

export const loader = async ({ request }) => {
  return await requireUserId(request);
  // const userId = await requireUserId(request);
  // const noteListItems = await getNoteListItems({ userId });
  // return json({ noteListItems });
};

export default function NotesPage() {
  // const data = useLoaderData();
  const user = useUser();

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex mx-auto">
        <Sidebar user={user} />

        <main className="flex w-[600px] flex-col border-r border-gray-200 dark:border-gray-800">
          {/* Top */}
          <div className="flex items-center flex-shrink-0 px-4 py-3 text-xl font-bold border-b border-gray-200 dark:border-gray-800">
            <span>Latest posts</span>
          </div>

          <div className="overflow-y-auto">
            {/* Tweet Form */}
            <div className="flex p-4 border-b border-gray-200 dark:border-gray-800">
              <img
                className="w-12 h-12 mr-2 rounded-full"
                src="https://source.boringavatars.com/marble/120/"
                alt="#"
              />
              <form className="flex flex-col flex-1" action="#">
                <textarea
                  className="px-2 py-3 text-xl bg-white dark:bg-black"
                  placeholder="What's happening?"
                  name="micropost"
                  id="micropost"
                  rows="1"
                />
                <button
                  className="self-start px-5 py-3 mt-2 font-bold leading-none text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                  type="submit"
                >
                  Post
                </button>
              </form>
            </div>
          </div>

          <div class="h-2 border-b border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900" />

          {/* <div>
            {data.noteListItems.length === 0 ? (
              <p>No notes</p>
            ) : (
              <ol>
                {data.noteListItems.map((note) => (
                  <li key={note.id}>
                    <NavLink to={note.id}>📝 {note.title}</NavLink>
                  </li>
                ))}
              </ol>
            )}
          </div> */}
        </main>
      </div>
    </div>
  );
}
