import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserPostsReplies } from "~/models/post.server";
import { getUserId } from "~/session.server";
import Post from "~/components/Post";

export const loader = async ({ request, params }) => {
  const userId = await getUserId(request);
  const posts = await getUserPostsReplies({
    username: params.username,
    userId,
  });
  return json({ posts });
};

export default function UserPosts() {
  const { posts } = useLoaderData();

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
