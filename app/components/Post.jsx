import { Link, useFetcher } from "@remix-run/react";

import { formatTimeago } from "~/utils/helpers";
import {
  CommentIcon,
  RepostIcon,
  LikeIcon,
  SmallRepostIcon,
} from "~/components/Icons";

const Post = ({ post: _post }) => {
  const fetcher = useFetcher();
  const isRepost = _post.repost && !_post.body;
  const post = _post.repost && !_post.body ? _post.repost : _post;

  return (
    <div className="flex flex-col border-b border-gray-200 px-4 pt-4 pb-3 transition-colors hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-800/40">
      {isRepost && (
        <Link
          to={`/users/${_post.author.username}`}
          className="group mb-2 ml-16 flex items-center self-start text-gray-500"
        >
          <SmallRepostIcon />
          <div className="ml-1 text-sm font-medium text-gray-500 group-hover:underline">
            {_post.author.name || _post.author.username} reposted
          </div>
        </Link>
      )}
      <div className="flex max-w-full">
        {/* Avatar  */}
        <Link
          to={`/users/${post.author.username}`}
          className="mr-4 flex-shrink-0 self-start transition-opacity hover:opacity-90"
        >
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              className="h-12 w-12 rounded-full object-cover"
              alt={post.author.name || post.author.username}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-900" />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          {/* Post header  */}
          <div className="flex">
            <Link
              to={`/users/${post.author.username}`}
              className="flex-shrink-1 group flex min-w-0 whitespace-nowrap"
            >
              <span className="overflow-hidden text-ellipsis font-bold group-hover:underline">
                {post.author.name || post.author.username}
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

          {post.replyTo && (
            <Link
              to={`/posts/${post.replyTo.id}`}
              className="group text-sm font-medium text-gray-500"
            >
              replying to{" "}
              <span className="group-hover:underline">
                @{post.replyTo.author.username}
              </span>
            </Link>
          )}

          {/* Post body  */}
          <div className="mt-1 space-y-2 leading-snug">
            {post.body?.split("\n").map((item, key) => {
              return <p key={key}>{item}</p>;
            })}
          </div>

          {/* Post footer  */}
          <div className="mt-2 flex space-x-4 sm:space-x-10">
            {/* Comments  */}
            <Link
              to={`/posts/${post.id}`}
              className="group flex items-center text-gray-400 hover:text-blue-500 dark:text-gray-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/40">
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
                  className="group flex items-center text-green-500 "
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-green-100/80 dark:group-hover:bg-green-900/40">
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
                  className="group flex items-center text-gray-400 hover:text-green-500 dark:text-gray-600"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-green-100/80 dark:group-hover:bg-green-900/40">
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
                  className="group flex items-center text-pink-500 "
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-pink-100/80 dark:group-hover:bg-pink-900/40">
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
                  className="group flex items-center text-gray-400 hover:text-pink-500 dark:text-gray-600"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-pink-100/80 dark:group-hover:bg-pink-900/40">
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
    </div>
  );
};

export default Post;
