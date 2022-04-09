import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserLikedPosts } from "~/models/post.server";
import { getSessionUserId } from "~/session.server";
import Post from "~/components/Post";

export const loader = async ({ request, params }) => {
  const userId = await getSessionUserId(request);
  const posts = await getUserLikedPosts({ username: params.username, userId });
  return json({ posts });
};

export default function UserLikes() {
  const { posts } = useLoaderData();

  return (
    <>
      {!posts || posts.length === 0 ? (
        <div className="w-full pt-12 text-center text-gray-300 dark:text-gray-500">
          No likes
        </div>
      ) : (
        posts?.map((post) => <Post key={post.id} post={post} />)
      )}
    </>
  );
}
