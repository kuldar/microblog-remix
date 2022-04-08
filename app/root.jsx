import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex text-gray-900 bg-white dark:bg-black dark:text-white">
        <div className="flex flex-1 h-screen mx-auto md:flex-initial">
          <Sidebar />
          <main className="flex w-full flex-col border-r border-gray-200 dark:border-gray-800 md:w-[600px]">
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
