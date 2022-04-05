import * as React from "react";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useActionData,
  useNavigate,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { formatDate, useOptionalUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { getPost, createPost } from "~/models/post.server";
import {
  ArrowLeftIcon,
  CommentIcon,
  LikeIcon,
  RepostIcon,
} from "~/components/Icons";

export const loader = async ({ request, params }) => {
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
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

export default function NoteDetailsPage() {
  const user = useOptionalUser();
  const { post } = useLoaderData();
  const navigate = useNavigate();

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
      <div className="flex items-center flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8"
        >
          <ArrowLeftIcon />
        </button>

        {/* Title */}
        <div className="ml-3 text-xl font-bold leading-tight">Thread</div>
      </div>

      <div className="overflow-y-auto">
        {/* Post */}
        <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center mb-4">
            <Link
              to={`/users/${post.author.username}`}
              className="transition-opacity hover:opacity-90"
            >
              {post.author.avatarUrl ? (
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://source.boringavatars.com/marble/140/"
                  alt={post.author.username}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full dark:bg-gray-900" />
              )}
            </Link>
            <Link to={`/users/${post.author.username}`} className="ml-3 group">
              <div className="font-bold leading-tight group-hover:underline">
                {post.author.name || post.author.username}
              </div>
              <div className="leading-tight text-gray-500">
                @{post.author.username}
              </div>
            </Link>
          </div>

          {/* Text */}
          <div className="mb-2 space-y-4 text-xl leading-tight">
            {post.body.split("\n").map((item, key) => {
              return <p key={key}>{item}</p>;
            })}
          </div>

          {/* Timestamp */}
          <div className="py-2 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            {/* 9:11 AM · Aug 4, 2021 */}
            {formatDate(post.createdAt)}
          </div>

          {/* Stats */}
          <div className="flex py-3 space-x-4 border-t border-b border-gray-200 dark:border-gray-800">
            <a className="flex space-x-2 group" href="#">
              <div className="font-bold">2</div>
              <div className="text-gray-500 group-hover:underline">Reposts</div>
            </a>
            <a className="flex space-x-2 group" href="#">
              <div className="font-bold">89</div>
              <div className="text-gray-500 group-hover:underline">Likes</div>
            </a>
          </div>

          {/* Actions */}
          <div className="flex py-2 mb-3 space-x-10 border-b border-gray-200 dark:border-gray-800">
            <Link
              to="#"
              className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-blue-100/50 hover:text-blue-500 dark:text-gray-600 dark:hover:bg-blue-900/50"
            >
              <CommentIcon />
            </Link>

            <Link
              to="#"
              className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-green-100/50 hover:text-green-600 dark:text-gray-600 dark:hover:bg-green-900/50"
            >
              <RepostIcon />
            </Link>

            <Link
              to="#"
              className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-pink-100/50 hover:text-pink-500 dark:text-gray-600 dark:hover:bg-pink-900/50"
            >
              <LikeIcon />
            </Link>
          </div>

          {/* New post form */}
          {user && (
            <Form method="post" className="flex items-start">
              <Link
                to={`/users/${user.username}`}
                className="transition-opacity hover:opacity-90"
              >
                {user.avatarUrl ? (
                  <img
                    className="w-12 h-12 mr-2 rounded-full"
                    src={user.avatarUrl}
                    alt={user.username}
                  />
                ) : (
                  <div className="w-12 h-12 mr-2 bg-gray-100 rounded-full dark:bg-gray-900" />
                )}
              </Link>

              <textarea
                placeholder="What's happening?"
                ref={bodyRef}
                name="body"
                rows={1}
                aria-invalid={actionData?.errors?.body ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.body ? "body-error" : undefined
                }
                className="flex-1 px-2 py-3 text-xl bg-white dark:bg-black"
              />
              {actionData?.errors?.body && (
                <div id="body-error">{actionData.errors.body}</div>
              )}
              <button
                className="px-5 py-3 mt-1 font-bold leading-none text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                type="submit"
              >
                Reply
              </button>
            </Form>
          )}
        </div>

        {/* Divider */}
        <div className="h-2 bg-gray-100 border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900" />

        {/* Replies */}
        <div>
          {/* <Post />
          <Post /> */}
        </div>
      </div>
    </>
  );
}
