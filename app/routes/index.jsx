import { json, redirect } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";

// import { getAllPosts } from "~/models/post.server";
import { getUserId } from "~/session.server";
// import Post from "~/components/Post";

// Loader
export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/posts");
  } else {
    return redirect("/explore");
  }
};

// export default function Index() {
//   const { posts } = useLoaderData();
//   return (
//     <>
//       <div className="flex items-center flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
//         <div className="text-xl font-bold leading-tight">Latest posts</div>
//       </div>

//       <div className="overflow-y-auto">
//         {posts.map((post) => (
//           <Post key={post.id} post={post} />
//         ))}
//       </div>
//     </>
//   );
// }
