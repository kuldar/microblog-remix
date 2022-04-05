import { json } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { likePost, unlikePost } from "~/models/post.server";

// Action
export const action = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);

  if (_action === "like") {
    const postLike = await likePost({ postId: params.postId, userId });
    return json({ postLike });
  }

  if (_action === "unlike") {
    await unlikePost({
      postId: params.postId,
      userId,
    });
    return json({});
  }
};
