import * as React from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { validateEmail } from "~/utils/validation";
import { getSessionUserId, createUserSession } from "~/session.server";
import { confirmUserEmail } from "~/models/user.server";

async function confirmAndGetUser({ email: _email, code: _code }) {
  let errors = {};

  // Validate email
  const email = validateEmail(_email);
  if (email.error) errors = { ...errors, email: email.error };

  // Validate code
  const code = _code.toLowerCase();
  if (typeof code !== "string" || code === "")
    errors = { ...errors, code: "Please enter a confirmation code" };

  // Return any validation errors
  if (Object.keys(errors).length !== 0) return { errors };

  // Verify login information
  const user = await confirmUserEmail({ email, code });
  if (!user) return { errors: { form: "Invalid email or code" } };

  return { user };
}

// Loader
export const loader = async ({ request }) => {
  // Redirect if user is already logged in
  const sessionUserId = await getSessionUserId(request);
  if (sessionUserId) return redirect("/posts");

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const code = url.searchParams.get("code");

  if (
    typeof email === "string" &&
    typeof code === "string" &&
    email !== "" &&
    code !== ""
  ) {
    const { user, errors } = await confirmAndGetUser({ email, code });
    if (errors) return json({ errors }, { status: 400 });
    if (user.id) {
      // Create a logged in session cookie
      return createUserSession({
        request,
        userId: user.id,
        redirectTo: "/posts",
      });
    }
  }

  return json({ email, code });
};

// Action
export const action = async ({ request }) => {
  const formData = await request.formData();
  const formEmail = formData.get("email");
  const formCode = formData.get("code");

  const { user, errors } = await confirmAndGetUser({
    email: formEmail,
    code: formCode,
  });

  if (errors) return json({ errors }, { status: 400 });
  if (user.id) {
    // Create a logged in session cookie
    return createUserSession({
      request,
      userId: user.id,
      redirectTo: "/posts",
    });
  }
  return json({ errors: { form: "Something went wrong" } }, { status: 400 });
};

// Page meta information
export const meta = () => {
  return { title: "Verify email address" };
};

// Login page
export default function LoginPage() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const emailRef = React.useRef(null);
  const codeRef = React.useRef(null);

  // Focus inputs in case of errors
  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.code) {
      codeRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col w-full px-6 py-6 mx-auto my-auto space-y-6 md:w-96 md:px-0">
      {/* Title */}
      <h1 className="text-3xl font-bold">Confirm email address</h1>
      {loaderData?.email ? (
        <p className="text-gray-400">
          Thank you for joining Microblog! Please enter the confirmation code
          sent to{" "}
          <span className="text-black dark:text-white">{loaderData.email}</span>
        </p>
      ) : (
        <p className="text-gray-400">
          Please enter your email address and the confirmation code sent to it.
        </p>
      )}

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
            defaultValue={loaderData?.email}
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
          <label htmlFor="code" className="font-semibold">
            Confirmation code
          </label>

          <input
            id="code"
            ref={codeRef}
            name="code"
            type="text"
            defaultValue={loaderData?.code}
            autoComplete="current-code"
            aria-invalid={actionData?.errors?.code ? true : undefined}
            aria-describedby="code-error"
            className="p-3 bg-white border border-gray-300 rounded outline-none dark:border-gray-600 dark:bg-black"
          />
          {actionData?.errors?.code && (
            <div id="code-error" className="text-sm text-red-400">
              {actionData.errors.code}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="p-4 text-lg font-bold leading-none text-center text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
        >
          Confirm
        </button>
      </Form>
    </div>
  );
}
