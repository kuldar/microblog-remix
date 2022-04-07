import * as React from "react";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useActionData,
  useNavigate,
  useFetcher,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import Post from "~/components/Post";
import { formatDate, useOptionalUser } from "~/utils";
import { requireUserId, getUserId } from "~/session.server";
import {
  getPost,
  createReply,
  likePost,
  unlikePost,
  repostPost,
  unpostPost,
} from "~/models/post.server";
import {
  ArrowLeftIcon,
  CommentIcon,
  LikeIcon,
  RepostIcon,
} from "~/components/Icons";

// Loader
export const loader = async ({ request, params }) => {
  invariant(params.postId, "postId not found");
  const userId = await getUserId(request);

  const post = await getPost({ id: params.postId, userId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

// Action
export const action = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);

  if (_action === "repost") {
    const postLike = await repostPost({ postId: params.postId, userId });
    if (!postLike) return json({ error: "Problem with reposting the post" });
    return json({ ok: true });
  }

  if (_action === "unpost") {
    await unpostPost({ postId: params.postId, userId });
    return json({});
  }

  if (_action === "like") {
    const postLike = await likePost({ postId: params.postId, userId });
    if (!postLike) return json({ error: "Problem with liking the post" });
    return json({ ok: true });
  }

  if (_action === "unlike") {
    await unlikePost({ postId: params.postId, userId });
    return json({});
  }

  if (_action === "reply") {
    const body = formData.get("body");

    if (typeof body !== "string" || body.length === 0) {
      return json({ errors: { body: "Body is required" } }, { status: 400 });
    }

    const post = await createReply({ body, userId, postId: params.postId });

    return json({ post });
  }
};

// Post Page
export default function PostPage() {
  const user = useOptionalUser();
  const { post } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const actionData = useActionData();
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (bodyRef.current) {
      bodyRef.current.value = "";
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
          <div className="flex items-center mb-2">
            <Link
              to={`/users/${post.author.username}`}
              className="transition-opacity hover:opacity-90"
            >
              {post.author.avatarUrl ? (
                <img
                  className="object-cover w-12 h-12 rounded-full"
                  src={post.author.avatarUrl}
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

          {post.replyTo && (
            <Link
              to={`/posts/${post.replyTo.id}`}
              className="mb-2 text-sm font-medium text-gray-500 group"
            >
              replying to{" "}
              <span className="group-hover:underline">
                @{post.replyTo.author.username}
              </span>
            </Link>
          )}

          {/* Text */}
          <div className="mb-2 space-y-4 text-xl leading-tight">
            {post.body.split("\n").map((item, key) => {
              return <p key={key}>{item}</p>;
            })}
          </div>

          {/* Timestamp */}
          <div className="py-2 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            {formatDate(post.createdAt)}
          </div>

          {/* Stats */}
          <div className="flex py-3 space-x-4 border-t border-b border-gray-200 dark:border-gray-800">
            <a className="flex space-x-2 group" href="#">
              <div className="font-bold">{post._count.reposts}</div>
              <div className="text-gray-500 group-hover:underline">
                {post._count.reposts === 1 ? "Repost" : "Reposts"}
              </div>
            </a>
            <a className="flex space-x-2 group" href="#">
              <div className="font-bold">{post._count.likes}</div>
              <div className="text-gray-500 group-hover:underline">
                {post._count.likes === 1 ? "Like" : "Likes"}
              </div>
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

            {/* Repost  */}
            {post.reposts?.length > 0 ? (
              <fetcher.Form method="post" action={`/posts/${post.id}`}>
                <button
                  name="_action"
                  value="unpost"
                  className="flex items-center justify-center w-8 h-8 text-green-600 transition-colors rounded-full hover:bg-green-100/50 dark:hover:bg-green-900/50"
                >
                  <RepostIcon />
                </button>
              </fetcher.Form>
            ) : (
              <fetcher.Form method="post" action={`/posts/${post.id}`}>
                <button
                  name="_action"
                  value="repost"
                  className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-green-100/50 hover:text-green-600 dark:text-gray-600 dark:hover:bg-green-900/50"
                >
                  <RepostIcon />
                </button>
              </fetcher.Form>
            )}

            {/* Likes  */}
            {post.likes?.length > 0 ? (
              <fetcher.Form method="post" action={`/posts/${post.id}`}>
                <button
                  name="_action"
                  value="unlike"
                  className="flex items-center justify-center w-8 h-8 text-pink-500 transition-colors rounded-full hover:bg-pink-100/50 dark:hover:bg-pink-900/50"
                >
                  <LikeIcon />
                </button>
              </fetcher.Form>
            ) : (
              <fetcher.Form method="post" action={`/posts/${post.id}`}>
                <button
                  name="_action"
                  value="like"
                  className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-pink-100/50 hover:text-pink-500 dark:text-gray-600 dark:hover:bg-pink-900/50"
                >
                  <LikeIcon />
                </button>
              </fetcher.Form>
            )}
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
                    className="object-cover w-12 h-12 mr-2 rounded-full"
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
                className="flex-1 px-2 py-3 text-xl bg-white outline-none dark:bg-black"
              />
              {actionData?.errors?.body && (
                <div id="body-error">{actionData.errors.body}</div>
              )}
              <button
                name="_action"
                value="reply"
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
          {post.replies?.map((reply) => (
            <Post key={reply.id} post={reply} />
          ))}
        </div>
      </div>
    </>
  );
}
