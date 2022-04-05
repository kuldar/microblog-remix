import { prisma } from "~/db.server";

export function getPost({ id }) {
  return prisma.post.findFirst({
    where: { id },
    include: { author: true },
  });
}

export function getAllPosts() {
  return prisma.post.findMany({
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: true,
      _count: { select: { likes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getUserPosts({ username }) {
  return prisma.post.findMany({
    where: { author: { is: { username } } },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: true,
      _count: { select: { likes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPost({ body, userId }) {
  return prisma.post.create({
    data: {
      body,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePost({ id }) {
  return prisma.post.deleteMany({
    where: { id },
  });
}

// Like Post
export async function likePost({ postId, userId }) {
  const postLike = await prisma.postLike.create({
    data: {
      postId,
      userId,
    },
  });

  return postLike;
}

// Unlike Post
export async function unlikePost({ postId, userId }) {
  return await prisma.postLike.delete({
    where: { userId_postId: { postId, userId } },
  });
}
