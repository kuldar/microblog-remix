import * as React from "react";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import { validateEmail, validatePassword } from "~/utils/validation";
import { getUserId, createUserSession } from "~/session.server";
import { getUserByLogin } from "~/models/user.server";

// Loader
export const loader = async ({ request }) => {
  // Redirect if user is already logged in
  const userId = await getUserId(request);
  if (userId) return redirect("/posts");

  return json({});
};

// Action
export const action = async ({ request }) => {
  const formData = await request.formData();
  const formEmail = formData.get("email");
  const formPassword = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  let errors = {};

  // Validate email
  const email = validateEmail(formEmail);
  if (email.error) errors = { ...errors, email: email.error };

  // Validate password
  const password = validatePassword(formPassword);
  if (password.error) errors = { ...errors, password: password.error };

  // Return any validation errors
  if (Object.keys(errors).length !== 0) {
    return json({ errors }, { status: 400 });
  }

  // Verify login information
  const user = await getUserByLogin({ email, password });
  if (!user) {
    return json(
      { errors: { form: "Invalid email or password" } },
      { status: 400 }
    );
  }

  // Create session cookie for successful login
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

// Page meta information
export const meta = () => {
  return { title: "Log in to Microblog" };
};

// Login page
export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/posts";
  const actionData = useActionData();
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  // Focus inputs in case of errors
  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col w-full px-6 py-6 mx-auto my-auto space-y-6 md:w-96 md:px-0">
      {/* Title */}
      <div className="text-3xl font-bold">Log in to Microblog</div>

      {/* Form errors */}
      {actionData?.errors?.form && (
        <div id="form-error" className="text-sm text-red-400">
          {actionData.errors.form}
        </div>
      )}

      {/* Form */}
      <Form method="post" className="flex flex-col space-y-4 md:space-y-6">
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
            className="p-3 bg-white border border-gray-300 rounded outline-none dark:border-gray-600 dark:bg-black"
          />
          {actionData?.errors?.email && (
            <div id="email-error" className="text-sm text-red-400">
              {actionData.errors.email}
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
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className="p-3 bg-white border border-gray-300 rounded outline-none dark:border-gray-600 dark:bg-black"
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
          Log in
        </button>

        <div className="flex items-center justify-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="mr-2"
          />
          <label htmlFor="remember">Remember me</label>
        </div>

        <div className="flex justify-center">
          <span className="mr-2">Don't have an account?</span>
          <Link
            className="text-blue-500 hover:underline"
            to={{
              pathname: "/join",
              search: searchParams.toString(),
            }}
          >
            Sign up
          </Link>
        </div>
      </Form>
    </div>
  );
}
