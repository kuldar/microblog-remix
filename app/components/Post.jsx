import { Link } from "@remix-run/react";
import { formatTimeago } from "~/utils";
import { CommentIcon, RepostIcon, LikeIcon } from "./Icons";

const Post = ({ post }) => {
  return (
    <div className="flex px-4 pt-4 pb-3 transition-colors border-b border-gray-200 hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-900/30">
      {/* Avatar  */}
      <Link
        to={`/users/${post.author.username}`}
        className="self-start flex-shrink-0 mr-4 transition-opacity hover:opacity-90"
      >
        {post.author.avatarUrl ? (
          <img
            src={post.author.avatarUrl}
            className="w-12 h-12 rounded-full"
            alt={post.author.name || post.author.username}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-900" />
        )}
      </Link>

      <div>
        {/* Post header  */}
        <div className="flex mb-1">
          <Link to={`/users/${post.author.username}`} className="group">
            <span className="font-bold group-hover:underline">
              {post.author.name || post.author.username}
            </span>
            <span className="ml-1 text-gray-500">@{post.author.username}</span>
          </Link>
          <span className="ml-1 text-gray-500">·</span>
          <a
            href={`/posts/${post.id}`}
            className="ml-1 text-gray-500 hover:underline"
          >
            {formatTimeago(post.createdAt)}
          </a>
        </div>

        {/* Post body  */}
        <div className="space-y-2 leading-snug">
          {post.body.split("\n").map((item, key) => {
            return <p key={key}>{item}</p>;
          })}
        </div>

        {/* Post footer  */}
        <div className="flex mt-2 space-x-10">
          {/* Comments  */}
          <a
            href="/"
            className="flex items-center text-gray-400 group hover:text-blue-500 dark:text-gray-600"
          >
            <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/40">
              <CommentIcon />
            </div>
            <span className="px-2 transition-colors">2</span>
          </a>

          {/* Reposts  */}
          <a
            href="/"
            className="flex items-center text-gray-400 group hover:text-green-600 dark:text-gray-600"
          >
            <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-green-100/80 dark:group-hover:bg-green-900/40">
              <RepostIcon />
            </div>
            <span className="px-2 transition-colors">2</span>
          </a>

          {/* Likes  */}
          <a
            href="/"
            className="flex items-center text-gray-400 group hover:text-pink-500 dark:text-gray-600"
          >
            <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full group-hover:bg-pink-100/80 dark:group-hover:bg-pink-900/40">
              <LikeIcon />
            </div>
            <span className="px-2 transition-colors">2</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;
