import { Link, useFetcher } from "@remix-run/react";

import { formatTimeago } from "~/utils";
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
    <>
      <div className="flex flex-col px-4 pt-4 pb-3 transition-colors border-b border-gray-200 hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-800/40">
        {isRepost && (
          <Link
            to={`/users/${_post.author.username}`}
            className="flex items-center self-start mb-2 ml-16 text-gray-500 group"
          >
            <SmallRepostIcon />
            <div className="ml-1 text-sm font-medium text-gray-500 group-hover:underline">
              {_post.author.name || _post.author.username} reposted
            </div>
          </Link>
        )}
        <div className="flex">
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

          <div className="w-full">
            {/* Post header  */}
            <div className="flex">
              <Link to={`/users/${post.author.username}`} className="group">
                <span className="font-bold group-hover:underline">
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
                className="text-sm font-medium text-gray-500 group"
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
            <div className="flex mt-2 space-x-10">
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
      </div>
    </>
  );
};

export default Post;
