import { Link, NavLink } from "@remix-run/react";

import { useOptionalUser } from "~/utils/helpers";
import {
  Logo,
  HomeIcon,
  ExploreIcon,
  UserIcon,
  SettingsIcon,
  EmailIcon,
  KeyIcon,
  VerifiedBadge,
} from "./Icons";

// Sidebar
const Sidebar = () => {
  const user = useOptionalUser();

  const userLinks = [
    { to: "/posts", icon: HomeIcon, text: "Home" },
    { to: "/explore", icon: ExploreIcon, text: "Explore" },
    { to: `/users/${user?.username}`, icon: UserIcon, text: "Profile" },
    { to: "/settings", icon: SettingsIcon, text: "Settings" },
  ];

  const guestLinks = [
    { to: "/explore", icon: ExploreIcon, text: "Explore" },
    { to: "/join", icon: EmailIcon, text: "Join" },
    { to: "/login", icon: KeyIcon, text: "Log In" },
  ];

  const links = user ? userLinks : guestLinks;

  return (
    <div className="flex flex-col w-auto px-0 py-1 border-r border-gray-200 dark:border-gray-800 sm:px-4 sm:py-2 lg:w-64">
      {/* Logo */}
      <Link
        to="/"
        className="self-start block p-4 transition-colors rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
      >
        <Logo />
      </Link>

      {/* Main Navigation */}
      <nav className="flex flex-col items-center self-stretch flex-1 lg:items-start">
        {links.map(({ to, icon: Icon, text }) => (
          <NavLink
            to={to}
            title={text}
            key={text}
            className={({ isActive }) =>
              `${
                isActive ? "text-blue-500" : "text-gray-900 dark:text-white"
              } flex items-center rounded-full bg-transparent p-4 text-xl font-bold leading-none transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30`
            }
          >
            <Icon />
            <span className="hidden ml-4 mr-1 lg:inline">{text}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Link */}
      {user && (
        <Link
          to={`/users/${user.username}`}
          className="flex p-3 transition-colors rounded-full cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
        >
          {user.avatarUrl ? (
            <img
              className="flex-shrink-0 object-cover w-10 h-10 bg-gray-100 rounded-full lg:mr-3"
              src={user.avatarUrl}
              alt={user.name || user.username}
            />
          ) : (
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-900 lg:mr-3" />
          )}
          <div className="hidden lg:block">
            <div className="flex items-center font-bold leading-tight">
              <span>{user.name || user.username}</span>
              {user.status === "verified" && (
                <VerifiedBadge className="ml-1 text-blue-500 dark:text-white" />
              )}
            </div>
            <div className="leading-tight text-gray-500">@{user.username}</div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
