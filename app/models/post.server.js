import { prisma } from "~/db.server";

export function getPost({ id }) {
  return prisma.post.findFirst({
    where: { id },
    include: { author: true },
  });
}

export function getAllPosts() {
  return prisma.post.findMany({
    select: { id: true, body: true, createdAt: true, author: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getUserPosts({ username }) {
  return prisma.post.findMany({
    where: { author: { is: { username } } },
    select: { id: true, body: true, createdAt: true, author: true },
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
