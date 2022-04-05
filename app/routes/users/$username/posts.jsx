import Post from "~/components/Post";

const posts = [
  {
    id: "1",
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia malesuada diam, sed faucibus ligula porttitor at. \n Aliquam erat volutpat. Sed et lectus ut nisi bibendum tincidunt.`,
    createdAt: "2022-04-05T13:42:48.221Z",
    author: {
      name: "Mr Example",
      username: "example",
      avatarUrl: "https://source.boringavatars.com/marble/140",
    },
  },
];

export default function UserPostsReplies() {
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
