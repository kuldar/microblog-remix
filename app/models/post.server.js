import { prisma } from "~/db.server";

// Get Post Likes
export function getPostLikes({ id, userId }) {
  return prisma.user.findMany({
    where: {
      likes: { some: { post: { id } } },
    },
  });
}

// Get Post Reposters
export async function getPostReposters({ id, userId }) {
  let reposterIds = [];

  const post = await prisma.post.findFirst({
    where: { id },
    select: { reposts: true },
  });

  post.reposts.map((repost) => reposterIds.push(repost.authorId));

  return prisma.user.findMany({
    where: { id: { in: reposterIds } },
    select: {
      avatarUrl: true,
      username: true,
      name: true,
      bio: true,
    },
  });
}

// Get Post Replies
export function getPostReplies({ id, userId }) {
  if (userId) {
    return prisma.post.findMany({
      where: { replyToId: id },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        likes: {
          where: { userId },
          select: { createdAt: true },
        },
        replyTo: { select: { id: true, author: true } },
        reposts: {
          where: { authorId: userId },
          select: { createdAt: true },
        },
        _count: { select: { likes: true, reposts: true } },
      },
    });
  } else {
    return prisma.post.findMany({
      where: { replyToId: id },
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

// Get Post
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
        replyTo: { select: { id: true, author: true } },
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
            _count: { select: { likes: true, reposts: true } },
          },
        },
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
        replyTo: { select: { id: true, author: true } },
        repost: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { username: true, name: true, avatarUrl: true } },
            _count: { select: { likes: true, reposts: true } },
          },
        },
      },
    });
  }
}

// Get All Posts
// export function getAllPosts() {
//   return prisma.post.findMany({
//     where: { replyToId: null },
//     select: {
//       id: true,
//       body: true,
//       createdAt: true,
//       author: true,
//       _count: { select: { likes: true, reposts: true } },
//       repost: {
//         select: {
//           id: true,
//           body: true,
//           createdAt: true,
//           author: { select: { username: true, name: true, avatarUrl: true } },
//           _count: { select: { likes: true, reposts: true } },
//         },
//       },
//     },
//     orderBy: { updatedAt: "desc" },
//   });
// }

// Get Latest Posts
export async function getLatestPosts({ limit = 10, userId }) {
  if (userId) {
    const users = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
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
        replyTo: { select: { id: true, author: true } },
        _count: { select: { likes: true, reposts: true, replies: true } },
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
            _count: { select: { likes: true, reposts: true, replies: true } },
          },
        },
      },
      take: limit,
    });
    return users;
  } else {
    const users = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        replyTo: { select: { id: true, author: true } },
        _count: { select: { likes: true, reposts: true, replies: true } },
        repost: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { username: true, name: true, avatarUrl: true } },
            _count: { select: { likes: true, reposts: true, replies: true } },
          },
        },
      },
      take: limit,
    });
    return users;
  }
}

// Get User Posts
export async function getUserPosts({ username, userId }) {
  if (userId) {
    return prisma.post.findMany({
      where: { AND: [{ author: { is: { username } } }, { replyToId: null }] },
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
        _count: { select: { likes: true, reposts: true, replies: true } },
        repost: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { username: true, name: true, avatarUrl: true } },
            replyTo: { select: { id: true, author: true } },
            reposts: {
              where: { authorId: userId },
              select: { createdAt: true },
            },
            likes: { where: { userId }, select: { createdAt: true } },
            _count: { select: { likes: true, reposts: true, replies: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } else {
    return prisma.post.findMany({
      where: { AND: [{ author: { is: { username } } }, { replyToId: null }] },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        _count: { select: { likes: true, reposts: true, replies: true } },
        repost: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { username: true, name: true, avatarUrl: true } },
            replyTo: { select: { id: true, author: true } },
            _count: { select: { likes: true, reposts: true, replies: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}

// Get User Post Replies
export async function getUserPostsReplies({ username, userId }) {
  if (userId) {
    return prisma.post.findMany({
      where: { AND: [{ author: { is: { username } } }, { repostId: null }] },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        likes: {
          where: { userId },
          select: { createdAt: true },
        },
        replyTo: { select: { id: true, author: true } },
        reposts: {
          where: { authorId: userId },
          select: { createdAt: true },
        },
        _count: { select: { likes: true, reposts: true, replies: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  } else {
    return prisma.post.findMany({
      where: { AND: [{ author: { is: { username } } }, { repostId: null }] },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: true,
        replyTo: { select: { id: true, author: true } },
        _count: { select: { likes: true, reposts: true, replies: true } },
        repost: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: { select: { username: true, name: true, avatarUrl: true } },
            replyTo: { select: { id: true, author: true } },
            _count: { select: { likes: true, reposts: true, replies: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}

// Get User Liked Posts
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

// Create Post
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

// Create Reply
export function createReply({ body, userId, postId }) {
  return prisma.post.create({
    data: {
      body,
      replyTo: { connect: { id: postId } },
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

// Delete Post
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
