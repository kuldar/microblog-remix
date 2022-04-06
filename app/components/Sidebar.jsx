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

  const styles = {
    sidebar:
      "flex flex-col w-24 px-4 py-2 border-r border-gray-200 dark:border-gray-800 lg:w-64",
    logo: "self-start block p-4 transition-colors rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
    nav: "flex flex-col items-start self-stretch flex-1",
    navLink:
      "flex items-center rounded-full bg-transparent py-4 pl-4 pr-5 text-xl font-bold leading-none transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
    navLinkActive: "text-blue-500",
    navLinkInactive: "text-gray-900 dark:text-white",
    navLinkText: "hidden ml-4 lg:inline",
    userLink:
      "flex p-3 transition-colors rounded-full cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
    avatar: "object-cover w-10 h-10 mr-3 bg-gray-100 rounded-full",
    avatarPlaceholder:
      "w-10 h-10 mr-3 bg-gray-100 rounded-full dark:bg-gray-900",
    name: "font-bold leading-tight",
    username: "leading-tight text-gray-500",
  };

  return (
    <div className={styles.sidebar}>
      <Link to="/" className={styles.logo}>
        <Logo />
      </Link>

      <nav className={styles.nav}>
        {links.map(({ to, icon: Icon, text }) => (
          <NavLink
            to={to}
            title={text}
            key={text}
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive ? styles.navLinkActive : styles.navLinkInactive
              }`
            }
          >
            <Icon />
            <span className={styles.navLinkText}>{text}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <Link to={`/users/${user.username}`} className={styles.userLink}>
          {user.avatarUrl ? (
            <img
              className={styles.avatar}
              src={user.avatarUrl}
              alt={user.name || user.username}
            />
          ) : (
            <div className={styles.avatarPlaceholder} />
          )}
          <div className="hidden lg:block">
            <div className={styles.name}>{user.name || user.username}</div>
            <div className={styles.username}>@{user.username}</div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
