import * as React from "react";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useActionData,
  useNavigate,
  useFetcher,
  useSubmit,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import TextareaAutosize from "react-textarea-autosize";

import { formatDate, formatTime, useOptionalUser } from "~/utils/helpers";
import { requireSessionUserId, getSessionUserId } from "~/session.server";
import {
  getPost,
  createReply,
  likePost,
  unlikePost,
  repostPost,
  unpostPost,
  deletePost,
} from "~/models/post.server";
import {
  ArrowLeftIcon,
  CommentIcon,
  LikeIcon,
  RepostIcon,
  TrashIcon,
  SmallRepostIcon,
} from "~/components/Icons";

// Loader
export const loader = async ({ request, params }) => {
  // Not sure what this does
  invariant(params.postId, "postId not found");

  // Get session user ID
  const sessionUserId = await getSessionUserId(request);

  // Get post by ID
  const post = await getPost({ id: params.postId, userId: sessionUserId });
  if (!post) return redirect("/posts");

  return json({ post });
};

// Action
export const action = async ({ request, params }) => {
  // Get session user ID
  const sessionUserId = await requireSessionUserId(request);

  // Get form data
  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);

  // Handle reposting
  if (_action === "repost") {
    const postLike = await repostPost({
      postId: params.postId,
      userId: sessionUserId,
    });
    if (!postLike) return json({ error: "Problem with reposting the post" });
    return json({ ok: true });
  }

  // Handle un-reposting
  if (_action === "unpost") {
    await unpostPost({ postId: params.postId, userId: sessionUserId });
    return json({ ok: true });
  }

  // Handle post liking
  if (_action === "like") {
    const postLike = await likePost({
      postId: params.postId,
      userId: sessionUserId,
    });
    if (!postLike) return json({ error: "Problem with liking the post" });
    return json({ ok: true });
  }

  // Handle post unliking
  if (_action === "unlike") {
    await unlikePost({ postId: params.postId, userId: sessionUserId });
    return json({ ok: true });
  }

  // Handle post deleting
  if (_action === "delete") {
    await deletePost({ postId: params.postId });
    return redirect("/posts");
  }

  // Handle replying to post
  if (_action === "reply") {
    const body = formData.get("body");

    if (typeof body !== "string" || body.length === 0) {
      return json(
        { errors: { body: "Can't post an empty reply" } },
        { status: 400 }
      );
    }

    const post = await createReply({
      body,
      userId: sessionUserId,
      postId: params.postId,
    });

    return json({ post });
  }
};

// Post Page
export default function PostPage() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const user = useOptionalUser();
  const { post: originalPost } = useLoaderData();

  const { isRepost, repost } = originalPost;
  const isMissingRepost = isRepost && !repost;
  const post = isRepost && !isMissingRepost ? repost : originalPost;

  const actionData = useActionData();
  const bodyRef = React.useRef(null);
  const formRef = React.useRef(null);

  // Focus input or clear form
  React.useEffect(() => {
    if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (bodyRef.current) {
      bodyRef.current.value = "";
    }
  }, [actionData]);

  React.useEffect(() => {
    let keysPressed = {};

    const keyDown = (event) => {
      keysPressed[event.key] = true;

      if (
        keysPressed["Meta"] &&
        keysPressed["Enter"] &&
        bodyRef.current === document.activeElement
      ) {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        formData.append("_action", "reply");
        keysPressed = {};
        submit(formData, { method: "post" });
      }
    };

    const keyUp = (event) => delete keysPressed[event.key];

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
    };
  }, []);

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
        <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-800">
          {/* Repost label */}
          {isRepost && (
            <Link
              to={`/users/${originalPost.author.username}`}
              className="flex items-center self-start mb-4 ml-2 text-gray-500 group"
            >
              <SmallRepostIcon />
              <div className="ml-1 text-sm font-medium text-gray-500 group-hover:underline">
                {originalPost.author.name || originalPost.author.username}{" "}
                reposted
              </div>
            </Link>
          )}

          {/* Post */}
          {isMissingRepost ? (
            <>
              <div className="px-2 py-4 mb-1 text-sm text-center text-gray-500 bg-gray-100 border border-gray-200 rounded-md dark:border-gray-800 dark:bg-gray-900/50">
                This post has been deleted
              </div>
              {user && user.id === post.author.id && (
                <Form method="post">
                  <button
                    name="_action"
                    value="delete"
                    type="submit"
                    className="flex items-center mt-2 text-gray-500 group"
                  >
                    <TrashIcon className="transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                    <span className="ml-2 group-hover:underline">
                      Delete repost
                    </span>
                  </button>
                </Form>
              )}
            </>
          ) : (
            <>
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
                <Link
                  to={`/users/${post.author.username}`}
                  className="ml-3 group"
                >
                  <div className="font-bold leading-tight group-hover:underline">
                    {post.author.name || post.author.username}
                  </div>
                  <div className="leading-tight text-gray-500">
                    @{post.author.username}
                  </div>
                </Link>
              </div>

              {post.isReply && post.replyTo && (
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

              {post.isReply && !post.replyTo && (
                <span className="mb-2 text-sm font-medium text-gray-500">
                  replying to deleted post
                </span>
              )}

              {/* Text */}
              <div className="mb-2 space-y-4 text-xl leading-tight">
                {post.body &&
                  post.body.split("\n").map((item, key) => {
                    return <p key={key}>{item}</p>;
                  })}
              </div>

              {/* Timestamp */}
              <Link
                to={`/posts/${post.id}`}
                className="self-start my-2 space-x-1 text-gray-500 group dark:border-gray-800"
              >
                <span className="group-hover:underline">
                  {formatTime(post.createdAt)}
                </span>
                <span>·</span>
                <span className="group-hover:underline">
                  {formatDate(post.createdAt)}
                </span>
              </Link>

              {/* Stats */}
              <div className="flex py-3 space-x-4 border-t border-b border-gray-200 dark:border-gray-800">
                <Link to={`/posts/${post.id}`} className="flex space-x-2 group">
                  <div className="font-bold">{post._count.replies}</div>
                  <div className="text-gray-500 group-hover:underline">
                    {post._count.replies === 1 ? "Reply" : "Replies"}
                  </div>
                </Link>
                <Link
                  to={`/posts/${post.id}/reposts`}
                  className="flex space-x-2 group"
                >
                  <div className="font-bold">{post._count.reposts}</div>
                  <div className="text-gray-500 group-hover:underline">
                    {post._count.reposts === 1 ? "Repost" : "Reposts"}
                  </div>
                </Link>
                <Link
                  to={`/posts/${post.id}/likes`}
                  className="flex space-x-2 group"
                >
                  <div className="font-bold">{post._count.likes}</div>
                  <div className="text-gray-500 group-hover:underline">
                    {post._count.likes === 1 ? "Like" : "Likes"}
                  </div>
                </Link>
                {user && user.id === post.author.id && (
                  <Form method="post" className="flex justify-end flex-1">
                    <button
                      name="_action"
                      value="delete"
                      type="submit"
                      className="flex items-center text-gray-500 group"
                    >
                      <TrashIcon className="transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                      <span className="ml-2 group-hover:underline">
                        Delete post
                      </span>
                    </button>
                  </Form>
                )}
              </div>

              {/* Actions */}
              <div className="flex py-2 mb-3 space-x-10 border-b border-gray-200 dark:border-gray-800">
                <Link
                  to="."
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
                <div className="flex">
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

                  <Form
                    method="post"
                    ref={formRef}
                    action={`/posts/${post.id}`}
                    className="flex items-start flex-1"
                  >
                    <div className="flex flex-col flex-1">
                      <TextareaAutosize
                        placeholder="Post your reply"
                        ref={bodyRef}
                        name="body"
                        rows={1}
                        minRows={1}
                        maxRows={5}
                        aria-invalid={
                          actionData?.errors?.body ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.body ? "body-error" : undefined
                        }
                        className="px-2 py-3 text-xl bg-white outline-none resize-none dark:bg-black"
                      />
                      {actionData?.errors?.body && (
                        <div id="body-error" className="text-sm text-red-400">
                          {actionData.errors.body}
                        </div>
                      )}
                    </div>

                    <button
                      name="_action"
                      value="reply"
                      className="px-5 py-3 mt-1 font-bold leading-none text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                      type="submit"
                    >
                      Reply
                    </button>
                  </Form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Replies */}
        {!isRepost && !isMissingRepost && (
          <>
            <div className="h-2 bg-gray-100 border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900" />
            <Outlet />
          </>
        )}
      </div>
    </>
  );
}
