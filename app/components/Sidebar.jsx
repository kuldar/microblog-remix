import { Link, NavLink } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import {
  Logo,
  HomeIcon,
  UserIcon,
  SettingsIcon,
  EmailIcon,
  KeyIcon,
} from "./Icons";

const Sidebar = () => {
  const user = useOptionalUser();

  const userLinks = [
    { to: "/posts", icon: HomeIcon, text: "Home" },
    { to: `/users/${user?.username}`, icon: UserIcon, text: "Profile" },
    { to: "/settings", icon: SettingsIcon, text: "Settings" },
  ];

  const guestLinks = [
    { to: "/join", icon: EmailIcon, text: "Join" },
    { to: "/login", icon: KeyIcon, text: "Log In" },
  ];

  const links = user ? userLinks : guestLinks;

  return (
    <div className="flex flex-col w-24 min-h-screen px-4 py-2 border-r border-gray-200 dark:border-gray-800 lg:w-64">
      <Link
        to="/"
        className="self-start block p-4 transition-colors rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
      >
        <Logo />
      </Link>

      <nav className="flex flex-col items-start self-stretch flex-1">
        {links.map(({ to, icon: Icon, text }) => (
          <NavLink
            to={to}
            title={text}
            key={text}
            className={({ isActive }) =>
              `${
                isActive ? "text-blue-500" : "text-gray-900 dark:text-white"
              } flex items-center rounded-full bg-transparent py-4 pl-4 pr-5 text-xl font-bold leading-none transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30`
            }
          >
            <Icon />
            <span className="hidden ml-4 lg:inline">{text}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <Link
          to={`/users/${user.username}`}
          className="flex p-3 transition-colors rounded-full cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
        >
          {user.avatarUrl ? (
            <img
              className="w-10 h-10 mr-3 bg-gray-100 rounded-full"
              src={user.avatarUrl}
              alt="#"
            />
          ) : (
            <div className="w-10 h-10 mr-3 bg-gray-100 rounded-full dark:bg-gray-900" />
          )}
          <div className="hidden lg:block">
            <div className="font-bold leading-tight">
              {user.name || user.username}
            </div>
            <div className="leading-tight text-gray-500">@{user.username}</div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
