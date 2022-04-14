import * as React from "react";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";

import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "~/utils/validation";
import { getSessionUserId } from "~/session.server";
import { createUser, getUserByEmailOrUsername } from "~/models/user.server";
import { sendEmail } from "~/utils/mailer";

let isProduction = process.env.NODE_ENV === "production";

// Loader
export const loader = async ({ request }) => {
  // Redirect if user is already logged in
  const sessionUserId = await getSessionUserId(request);
  if (sessionUserId) return redirect("/posts");

  return json({});
};

// Action
export const action = async ({ request }) => {
  const formData = await request.formData();
  const formEmail = formData.get("email");
  const formUsername = formData.get("username");
  const formPassword = formData.get("password");

  let errors = {};

  // Validate email
  const email = validateEmail(formEmail);
  if (email.error) errors = { ...errors, email: email.error };

  // Validate username
  const username = validateUsername(formUsername);
  if (username.error) errors = { ...errors, username: username.error };

  // Validate password
  const password = validatePassword(formPassword);
  if (password.error) errors = { ...errors, password: password.error };

  // Return any validation errors
  if (Object.keys(errors).length !== 0) {
    return json({ errors }, { status: 400 });
  }

  // Check if user by given email already exists
  const existingUser = await getUserByEmailOrUsername({ email, username });

  // Check for unique email
  if (existingUser?.email === email) {
    errors = { ...errors, email: "A user with this email already exists" };
  }

  // Check for unique username
  if (existingUser?.username === username) {
    errors = {
      ...errors,
      username: "A user with this username already exists",
    };
  }

  // Return any existing user errors
  if (Object.keys(errors).length !== 0) {
    return json({ errors }, { status: 400 });
  }

  // Create new user in database
  const user = await createUser({ email, username, password });
  console.log({ user });

  // Check for any errors in creating user
  if (!user) {
    return json({ errors: { form: "Problem creating user" } }, { status: 400 });
  }

  const hostUrl = new URL(request.url).host;
  const protocol = new URL(request.url).protocol;
  const encodedEmail = encodeURIComponent(user.email);
  const html = `
    <h1>Welcome to Microblog!</h1>
    <p>Please verify your email address by clicking the link below.</p>
    <p><a href="${protocol}//${hostUrl}/verify-email?email=${encodedEmail}&code=${user.confirmationCode}">Verify email address</a></p>
    <p>Or enter the code <code>${user.confirmationCode}</code> at ${protocol}//${hostUrl}/verify-email</p>
  `;
  const text = `Welcome to Microblog! Please visit the link below to verify your email address. \n${protocol}//${hostUrl}/verify-email?email=${encodedEmail}&code=${user.confirmationCode}`;

  await sendEmail({ to: email, text, html });

  return redirect(
    `/verify-email?${new URLSearchParams({ email: user.email })}`
  );
};

// Page meta information
export const meta = () => {
  return {
    title: "Sign up for Microblog",
  };
};

// Join page
export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData();
  const transition = useTransition();

  const emailRef = React.useRef(null);
  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  console.log({ actionData });

  // Focus inputs in case of errors
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
      {/* Title */}
      <div className="text-3xl font-bold">Join Microblog</div>

      {/* Form errors */}
      {actionData?.errors?.form && (
        <div id="form-error" className="text-sm text-red-400">
          {actionData.errors.form}
        </div>
      )}

      {/* Form */}
      <Form method="post" className="flex flex-col space-y-6">
        {/* Email */}
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

        {/* Username */}
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

        {/* Password */}
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

        {/* Submit button */}
        <button
          type="submit"
          disabled={transition.state === "submitting"}
          className="p-4 text-lg font-bold leading-none text-center text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
        >
          Create account
        </button>

        {/* Login link */}
        <div className="flex justify-center">
          <span className="mr-2">Already have an account?</span>
          <Link
            className="text-blue-500 hover:underline"
            to={{ pathname: "/login", search: searchParams.toString() }}
          >
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
}
