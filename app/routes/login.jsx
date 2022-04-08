import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils";

export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email").toLowerCase().trim();
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid" } }, { status: 400 });
  }

  if (typeof password !== "string") {
    return json(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/posts",
  });
};

export const meta = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/posts";
  const actionData = useActionData();
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col py-6 mx-auto my-auto space-y-6 w-96">
      <div className="text-3xl font-bold">Log in to Microblog</div>

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
