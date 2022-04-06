import { prisma } from "~/db.server";

export function getPost({ id, userId }) {
  if (userId) {
    return prisma.post.findFirst({
      where: { id },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        likes: {
          where: { userId },
          select: { createdAt: true },
        },
        reposts: {
          where: { authorId: userId },
          select: { createdAt: true },
        },
        _count: { select: { likes: true, reposts: true } },
      },
    });
  } else {
    return prisma.post.findFirst({
      where: { id },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        _count: { select: { likes: true, reposts: true } },
      },
    });
  }
}

export function getAllPosts() {
  return prisma.post.findMany({
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: true,
      _count: { select: { likes: true, reposts: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getUserPosts({ username, userId }) {
  if (userId) {
    return prisma.post.findMany({
      where: { author: { is: { username } } },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        likes: {
          where: { userId },
          select: { createdAt: true },
        },
        reposts: {
          where: { authorId: userId },
          select: { createdAt: true },
        },
        _count: { select: { likes: true, reposts: true } },
        repost: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { username: true, name: true, avatarUrl: true } },
            reposts: {
              where: { authorId: userId },
              select: { createdAt: true },
            },
            likes: { where: { userId }, select: { createdAt: true } },
            _count: { select: { likes: true, reposts: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } else {
    return prisma.post.findMany({
      where: { author: { is: { username } } },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        _count: { select: { likes: true, reposts: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}

export async function getUserLikedPosts({ username, userId }) {
  if (userId) {
    return prisma.post.findMany({
      where: { likes: { some: { user: { is: { username } } } } },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        likes: {
          where: { userId },
          select: { createdAt: true },
        },
        reposts: {
          where: { authorId: userId },
          select: { createdAt: true },
        },
        _count: { select: { likes: true, reposts: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  } else {
    return prisma.post.findMany({
      where: { likes: { some: { user: { is: { username } } } } },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        _count: { select: { likes: true, reposts: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
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

// Repost Post
export async function repostPost({ postId, userId }) {
  const repost = await prisma.post.create({
    data: {
      authorId: userId,
      repostId: postId,
    },
  });

  return repost;
}

// Unpost Post
export async function unpostPost({ postId, userId }) {
  return await prisma.post.deleteMany({
    where: { AND: [{ authorId: userId }, { repostId: postId }] },
  });
}
