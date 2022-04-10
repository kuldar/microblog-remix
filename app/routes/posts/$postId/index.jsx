import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getPostReplies } from "~/models/post.server";
import { getSessionUserId } from "~/session.server";
import Post from "~/components/Post";

export const loader = async ({ request, params }) => {
  const userId = await getSessionUserId(request);
  const posts = await getPostReplies({ id: params.postId, userId });
  return json({ posts });
};

export default function PostReplies() {
  const { posts } = useLoaderData();

  return (
    <div>
      {!posts || posts.length === 0 ? (
        <div className="w-full pt-12 text-center text-gray-400 dark:text-gray-500">
          No replies
        </div>
      ) : (
        posts?.map((reply) => <Post key={reply.id} post={reply} />)
      )}
    </div>
  );
}
