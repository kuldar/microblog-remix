import { Form } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import Sidebar from "~/components/Sidebar";

export const loader = async ({ request }) => {
  return await requireUserId(request);
};

export default function SettingsPage() {
  const user = useUser();

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex mx-auto">
        <Sidebar user={user} />

        <main className="flex w-[600px] flex-col border-r border-gray-200 dark:border-gray-800">
          {/* Top */}
          <div className="flex items-center flex-shrink-0 px-4 py-3 text-xl font-bold border-b border-gray-200 dark:border-gray-800">
            <span>Settings</span>
          </div>

          <div className="overflow-y-auto">
            <Form action="/logout" method="post" className="p-4">
              <button
                type="submit"
                className="px-4 py-2 text-blue-100 rounded bg-slate-600 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
