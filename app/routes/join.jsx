import * as React from "react";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import { getUserId, createUserSession } from "~/session.server";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "~/models/user.server";
import { validateEmail } from "~/utils";

export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid" } }, { status: 400 });
  }

  if (typeof username !== "string") {
    return json(
      { errors: { username: "Username is required" } },
      { status: 400 }
    );
  }

  if (username.length < 3) {
    return json(
      { errors: { username: "Username must be at least 3 characters long" } },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9_.]+$/.test(username)) {
    return json(
      {
        errors: {
          username:
            "Username can only include letters, numbers, underscores and periods",
        },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { password: "Password must be at least 8 characters long" } },
      { status: 400 }
    );
  }

  const existingUserEmail = await getUserByEmail(email);
  if (existingUserEmail) {
    return json(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const existingUserUsername = await getUserByUsername(username);
  if (existingUserUsername) {
    return json(
      { errors: { username: "A user already exists with this username" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, username, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData();

  const emailRef = React.useRef(null);
  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col py-6 mx-auto space-y-6 w-96">
      <a href="/" className="self-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.63202 2.25406L14.3647 2.48735C14.4531 2.48279 14.5422 2.48048 14.6318 2.48048C14.8141 2.48048 14.9953 2.48907 15.1751 2.50678L15.1896 2.50713L15.1883 2.5081C16.4517 2.63575 17.6457 3.21469 18.6668 4.42945C19.0798 4.41694 20.544 4.42776 21.8996 4.43778C22.7289 4.44391 23.5176 4.44974 24 4.44974C23.3545 5.07505 20.3546 7.69731 19.7545 8.17827C20.4352 11.9534 19.337 14.6794 17.3633 16.6476L19.4769 19.2753L17.9092 20.5363L15.8134 17.9307C9.96687 21.9858 0 21.7431 0 21.7431C0 21.7431 1.04335 20.9145 2.44078 19.5396L2.47443 19.535C3.68958 19.3674 5.32417 19.1182 6.98651 18.7926C8.6369 18.4692 10.367 18.0606 11.7505 17.5644C12.438 17.3178 13.0996 17.0288 13.6375 16.6843C14.1261 16.3714 14.7682 15.853 14.9973 15.049C15.452 13.4529 15.1289 12.0048 14.2742 10.9121C13.4544 9.86384 12.2283 9.24253 10.9988 9.03011C10.3778 8.92283 9.78226 8.99977 9.25823 9.15118C9.3879 8.63159 9.47965 8.10898 9.52663 7.58618C9.52663 7.01252 9.62126 6.46098 9.79575 5.9463L4.63202 2.25406ZM14.9345 8.29126C15.5734 8.29126 16.0914 7.77327 16.0914 7.1343C16.0914 6.49532 15.5734 5.97733 14.9345 5.97733C14.2955 5.97733 13.7775 6.49532 13.7775 7.1343C13.7775 7.77327 14.2955 8.29126 14.9345 8.29126Z"
          />
          <path
            fill="currentColor"
            d="M13.5927 14.8054C12.8801 16.2497 7.70714 17.3076 4.02675 17.8873C1.91214 18.2204 0.290273 18.3957 0.290273 18.3957L6.55827 12.6129C6.55827 12.6129 7.4988 11.5794 8.67398 10.9198C9.33684 10.5478 10.0744 10.2947 10.7599 10.4131C12.6607 10.7415 14.3201 12.3039 13.6475 14.6644C13.6467 14.6674 13.6458 14.6703 13.6449 14.6733C13.6343 14.7088 13.621 14.7441 13.6051 14.7791C13.6011 14.7879 13.597 14.7967 13.5927 14.8054Z"
          />
        </svg>
      </a>

      <div className="text-3xl font-bold">Sign up for Microblog</div>

      <Form method="post" className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="font-semibold">
            Email address
          </label>

          <input
            ref={emailRef}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
          />
          {actionData?.errors?.email && (
            <div id="email-error" className="text-sm text-red-400">
              {actionData.errors.email}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="username" className="font-semibold">
            Username
          </label>

          <input
            ref={usernameRef}
            id="username"
            required
            name="username"
            type="text"
            autoComplete="username"
            aria-invalid={actionData?.errors?.username ? true : undefined}
            aria-describedby="username-error"
            className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
          />
          {actionData?.errors?.username && (
            <div id="username-error" className="text-sm text-red-400">
              {actionData.errors.username}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>

          <input
            id="password"
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className="p-3 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-black"
          />
          {actionData?.errors?.password && (
            <div id="password-error" className="text-sm text-red-400">
              {actionData.errors.password}
            </div>
          )}
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          class="rounded-full bg-blue-500 p-4 text-center text-lg font-bold leading-none text-white transition-colors hover:bg-blue-600"
        >
          Create Account
        </button>

        <div className="flex justify-center">
          <span className="mr-2">Already have an account?</span>
          <Link
            className="text-blue-500 hover:underline"
            to={{
              pathname: "/login",
              search: searchParams.toString(),
            }}
          >
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
}
