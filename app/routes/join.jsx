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
  if (userId) return redirect("/posts");
  return json({});
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email").toLowerCase().trim();
  const username = formData.get("username").toLowerCase().trim();
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

  const existingUserEmail = await getUserByEmail({ email });
  if (existingUserEmail) {
    return json(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const existingUserUsername = await getUserByUsername({ username });
  if (existingUserUsername) {
    return json(
      { errors: { username: "A user already exists with this username" } },
      { status: 400 }
    );
  }

  const user = await createUser({ email, username, password });

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo:
      typeof redirectTo === "string" && redirectTo !== ""
        ? redirectTo
        : "/posts",
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
    <div className="flex flex-col py-6 mx-auto my-auto space-y-6 w-96">
      <div className="text-3xl font-bold">Join Microblog</div>

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
          className="p-4 text-lg font-bold leading-none text-center text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
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
