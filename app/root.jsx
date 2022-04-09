import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getSessionUser } from "./session.server";
import Sidebar from "~/components/Sidebar";

// Styles
import stylesheetUrl from "./styles/styles.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links = () => {
  return [
    { rel: "stylesheet", href: stylesheetUrl },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
  ];
};

// Page meta info
export const meta = () => ({
  title: "Microblog",
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

// Loader
export const loader = async ({ request }) => {
  const user = await getSessionUser(request);
  return json({ user });
};

// Root app page
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
