import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import Sidebar from "~/components/Sidebar";

import stylesheetUrl from "./styles/styles.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

export const links = () => {
  return [
    { rel: "stylesheet", href: stylesheetUrl },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
  ];
};

export const meta = () => ({
  charset: "utf-8",
  title: "Microblog",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  const { user } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex text-gray-900 bg-white dark:bg-black dark:text-white">
        <div className="flex h-screen mx-auto">
          <Sidebar user={user} />
          <main className="flex w-[600px] flex-col border-r border-gray-200 dark:border-gray-800">
            <Outlet />
          </main>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
