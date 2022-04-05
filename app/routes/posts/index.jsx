import * as React from "react";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { createPost, getAllPosts } from "~/models/post.server";
import Post from "~/components/Post";

export const loader = async ({ request }) => {
  await requireUserId(request);
  const posts = await getAllPosts();
  return json({ posts });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const body = formData.get("body");

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  const post = await createPost({ body, userId });

  return json({ post });
};

export default function PostsPage() {
  const { posts } = useLoaderData();
  const user = useUser();

  const actionData = useActionData();
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      {/* Top */}
      <div className="flex items-center flex-shrink-0 px-4 py-3 text-xl font-bold border-b border-gray-200 dark:border-gray-800">
        <span>Latest posts</span>
      </div>

      <div className="overflow-y-auto">
        {/* Tweet Form */}
        <div className="flex p-4 border-b border-gray-200 dark:border-gray-800">
          {user.avatarUrl ? (
            <img
              className="w-12 h-12 mr-2 rounded-full"
              src={user.avatarUrl}
              alt={user.username}
            />
          ) : (
            <div className="w-12 h-12 mr-2 bg-gray-100 rounded-full dark:bg-gray-900" />
          )}

          <Form method="post" className="flex flex-col flex-1">
            <textarea
              placeholder="What's happening?"
              ref={bodyRef}
              name="body"
              rows={1}
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
              className="px-2 py-3 text-xl bg-white dark:bg-black"
            />
            {actionData?.errors?.body && (
              <div id="body-error">{actionData.errors.body}</div>
            )}
            <button
              type="submit"
              className="self-start px-5 py-3 mt-2 font-bold leading-none text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Post
            </button>
          </Form>
        </div>
      </div>

      <div className="h-2 bg-gray-100 border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900" />

      {posts.length === 0 ? (
        <p>No posts</p>
      ) : (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </>
      )}
    </>
  );
}
