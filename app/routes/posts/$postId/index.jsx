import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getPostReplies, getPost } from "~/models/post.server";
import { getSessionUserId } from "~/session.server";
import Post from "~/components/Post";

export const loader = async ({ request, params }) => {
  const sessionUserId = await getSessionUserId(request);
  const post = await getPost({ id: params.postId, userId: sessionUserId });
  const postId = post?.repost?.id ? post?.repost?.id : params.postId;
  const replies = await getPostReplies({ id: postId, userId: sessionUserId });
  return json({ replies });
};

export default function PostReplies() {
  const { replies } = useLoaderData();

  return (
    <div>
      {!replies || replies.length === 0 ? (
        <div className="w-full pt-12 text-center text-gray-400 dark:text-gray-500">
          No replies
        </div>
      ) : (
        replies?.map((reply) => <Post key={reply.id} post={reply} />)
      )}
    </div>
  );
}
