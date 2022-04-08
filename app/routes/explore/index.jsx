import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getLatestPosts } from "~/models/post.server";
import { getUserId } from "~/session.server";
import Post from "~/components/Post";

// Loader
export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  const posts = await getLatestPosts({ userId });
  return json({ posts });
};

// Explore Posts Page
export default function ExplorePostsPage() {
  const { posts } = useLoaderData();
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
