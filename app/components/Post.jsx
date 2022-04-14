import { Link, useFetcher } from "@remix-run/react";

import { formatTimeago } from "~/utils/helpers";
import {
  CommentIcon,
  RepostIcon,
  LikeIcon,
  SmallRepostIcon,
  VerifiedBadge,
} from "~/components/Icons";

const Post = ({ post: originalPost }) => {
  const fetcher = useFetcher();
  const { isRepost, repost } = originalPost;
  const isMissingRepost = isRepost && !repost;
  const post = isRepost && !isMissingRepost ? repost : originalPost;

  return (
    <div className="flex flex-col px-4 pt-4 pb-3 transition-colors border-b border-gray-200 hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-800/40">
      {/* Repost label */}
      {isRepost && (
        <Link
          to={`/posts/${originalPost.id}`}
          className="flex items-center self-start mb-2 ml-16 text-gray-500 group"
        >
          <SmallRepostIcon />
          <div className="ml-1 text-sm font-medium text-gray-500 group-hover:underline">
            {originalPost.author.name || originalPost.author.username} reposted
          </div>
        </Link>
      )}

      {/* Post */}
      {isMissingRepost ? (
        <div className="px-3 py-2 mt-1 mb-2 ml-16 text-sm text-center text-gray-500 bg-gray-100 border border-gray-200 rounded-md dark:border-gray-800 dark:bg-gray-900/50">
          This post has been deleted
        </div>
      ) : (
        <div className="flex max-w-full">
          {/* Avatar  */}
          <Link
            to={`/users/${post.author.username}`}
            className="self-start flex-shrink-0 mr-4 transition-opacity hover:opacity-90"
          >
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                className="object-cover w-12 h-12 rounded-full"
                alt={post.author.name || post.author.username}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-900" />
            )}
          </Link>
          <div className="flex-1 min-w-0">
            {/* Post header  */}
            <div className="flex">
              <Link
                to={`/users/${post.author.username}`}
                className="flex min-w-0 flex-shrink-1 group whitespace-nowrap"
              >
                <span className="flex items-center overflow-hidden font-bold text-ellipsis group-hover:underline">
                  <span>{post.author.name || post.author.username}</span>
                  {post.author.status === "verified" && (
                    <VerifiedBadge className="ml-1 text-blue-500 dark:text-white" />
                  )}
                </span>
                <span className="ml-1 text-gray-500">
                  @{post.author.username}
                </span>
              </Link>
              <span className="ml-1 text-gray-500">·</span>
              <a
                href={`/posts/${post.id}`}
                className="ml-1 text-gray-500 hover:underline"
              >
                {formatTimeago(post.createdAt)}
              </a>
            </div>

            {/* Replying to user */}
            {post.isReply && post.replyTo && (
              <Link
                to={`/posts/${post.replyTo.id}`}
                className="text-sm font-medium text-gray-500 group"
              >
                replying to{" "}
                <span className="group-hover:underline">
                  @{post.replyTo.author.username}
                </span>
              </Link>
            )}

            {/* Replying to deleted post */}
            {post.isReply && !post.replyTo && (
              <span className="text-sm font-medium text-gray-500">
                replying to deleted post
              </span>
            )}

            {/* Post body  */}
            <div className="mt-1 space-y-2 leading-snug">
              {post.body?.split("\n").map((item, key) => {
                return <p key={key}>{item}</p>;
              })}
            </div>

            {/* Post footer  */}
            <div className="flex mt-2 space-x-4 sm:space-x-10">
              {/* Comments  */}
              <Link
                to={`/posts/${post.id}`}
                className="flex items-center text-gray-400 group hover:text-blue-500 dark:text-gray-600"
              >
                <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/40">
                  <CommentIcon />
                </div>
                <span className="px-2 transition-colors">
                  {post._count.replies}
                </span>
              </Link>

              {/* Reposts  */}
              {post.reposts?.length > 0 ? (
                <fetcher.Form method="post" action={`/posts/${post.id}`}>
                  <button
                    name="_action"
                    value="unpost"
                    className="flex items-center text-green-500 group "
                  >
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-green-100/80 dark:group-hover:bg-green-900/40">
                      <RepostIcon />
                    </div>
                    <span className="px-2 transition-colors">
                      {post._count.reposts}
                    </span>
                  </button>
                </fetcher.Form>
              ) : (
                <fetcher.Form method="post" action={`/posts/${post.id}`}>
                  <button
                    name="_action"
                    value="repost"
                    className="flex items-center text-gray-400 group hover:text-green-500 dark:text-gray-600"
                  >
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-green-100/80 dark:group-hover:bg-green-900/40">
                      <RepostIcon />
                    </div>
                    <span className="px-2 transition-colors">
                      {post._count.reposts}
                    </span>
                  </button>
                </fetcher.Form>
              )}

              {/* Likes  */}
              {post.likes?.length > 0 ? (
                <fetcher.Form method="post" action={`/posts/${post.id}`}>
                  <button
                    name="_action"
                    value="unlike"
                    className="flex items-center text-pink-500 group "
                  >
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-pink-100/80 dark:group-hover:bg-pink-900/40">
                      <LikeIcon />
                    </div>
                    <span className="px-2 transition-colors">
                      {post._count.likes}
                    </span>
                  </button>
                </fetcher.Form>
              ) : (
                <fetcher.Form method="post" action={`/posts/${post.id}`}>
                  <button
                    name="_action"
                    value="like"
                    className="flex items-center text-gray-400 group hover:text-pink-500 dark:text-gray-600"
                  >
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-pink-100/80 dark:group-hover:bg-pink-900/40">
                      <LikeIcon />
                    </div>
                    <span className="px-2 transition-colors">
                      {post._count.likes}
                    </span>
                  </button>
                </fetcher.Form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
