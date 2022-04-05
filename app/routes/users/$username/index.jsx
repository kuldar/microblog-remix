import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserPosts } from "~/models/post.server";
import Post from "~/components/Post";

export const loader = async ({ request, params }) => {
  const posts = await getUserPosts({ username: params.username });
  return json({ posts });
};

export default function UserFeed() {
  const { posts } = useLoaderData();

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
