import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getPostLikes } from "~/models/post.server";
import { getUserId } from "~/session.server";
import User from "~/components/User";

export const loader = async ({ request, params }) => {
  const userId = await getUserId(request);
  const users = await getPostLikes({ id: params.postId, userId });
  return json({ users });
};

export default function PostLikes() {
  const { users } = useLoaderData();

  return (
    <div>
      {!users || users.length === 0 ? (
        <div className="w-full pt-12 text-center text-gray-300 dark:text-gray-500">
          No likes
        </div>
      ) : (
        users?.map((user) => <User key={user.id} user={user} />)
      )}
    </div>
  );
}
