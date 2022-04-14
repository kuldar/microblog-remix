import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { generateCode } from "~/utils/codeGenerator";

// Get session user by ID
export async function getSessionUserById({ id }) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatarUrl: true,
    },
  });
}

// Get user by email or username
export async function getUserByEmailOrUsername({ email, username }) {
  return prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });
}

// Get user by login info
export async function getUserByLogin({ email, password }) {
  // Get user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, status: true, password: { select: { hash: true } } },
  });

  // Check if user with password exists
  if (!user || !user.password) return null;

  // Check if user password matches
  const isMatchingPassword = await bcrypt.compare(password, user.password.hash);
  if (!isMatchingPassword) return null;

  // Return user
  return user;
}

// Confirm user email with code
export async function confirmUserEmail({ email, code }) {
  // Get user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true, confirmationCode: true, status: true },
  });

  // Check if we have user, user status is pending and the code matches
  if (!user || user.status !== "pending" || user.confirmationCode !== code)
    return null;

  // Activate user, remove code and return user
  const activatedUser = await prisma.user.update({
    where: { email },
    select: { id: true, email: true },
    data: { status: "active", confirmationCode: null },
  });

  return activatedUser;
}

/////////

// Get Latest Users
export async function getLatestUsers({ limit = 10, userId }) {
  if (userId) {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        avatarUrl: true,
        username: true,
        name: true,
        bio: true,
        followings: {
          where: { followedId: userId },
          select: { createdAt: true },
        },
        followers: {
          where: { followerId: userId },
          select: { createdAt: true },
        },
      },
    });
    return users;
  } else {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        avatarUrl: true,
        username: true,
        name: true,
        bio: true,
      },
    });
    return users;
  }
}

// Get User Followers
export async function getUserFollowers({ username, userId }) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { followers: true },
  });

  let followerIds = [];
  user.followers.map((follow) => followerIds.push(follow.followerId));

  return prisma.user.findMany({
    where: { id: { in: followerIds } },
    select: {
      id: true,
      avatarUrl: true,
      username: true,
      name: true,
      bio: true,
      followings: {
        where: { followedId: userId },
        select: { createdAt: true },
      },
      followers: {
        where: { followerId: userId },
        select: { createdAt: true },
      },
    },
  });
}

// Get User Followings
export async function getUserFollowings({ username, userId }) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { followings: true },
  });

  let followingIds = [];
  user.followings.map((follow) => followingIds.push(follow.followedId));

  return prisma.user.findMany({
    where: { id: { in: followingIds } },
    select: {
      id: true,
      avatarUrl: true,
      username: true,
      name: true,
      bio: true,
      followings: {
        where: { followedId: userId },
        select: { createdAt: true },
      },
      followers: {
        where: { followerId: userId },
        select: { createdAt: true },
      },
    },
  });
}

// Get User By Username
export async function getUserByUsername({ username, userId }) {
  if (userId) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
        location: true,
        website: true,
        followings: {
          where: { followedId: userId },
          select: { createdAt: true },
        },
        followers: {
          where: { followerId: userId },
          select: { createdAt: true },
        },
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
      },
    });
  } else {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
        location: true,
        website: true,
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
      },
    });
  }
}

// Get User Feed
export async function getUserFeed(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { followings: true },
  });

  let userIds = [userId];
  user.followings.map((follow) => userIds.push(follow.followedId));

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        { authorId: { in: userIds } },
        { isReply: false },
        { NOT: { AND: [{ isRepost: true }, { repost: null }] } },
      ],
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { username: true, name: true, avatarUrl: true } },
      reposts: { where: { authorId: userId }, select: { createdAt: true } },
      likes: { where: { userId }, select: { createdAt: true } },
      _count: { select: { likes: true, reposts: true, replies: true } },
      isRepost: true,
      isReply: true,
      replyTo: { select: { id: true, author: true } },
      repost: {
        select: {
          id: true,
          body: true,
          createdAt: true,
          isReply: true,
          isRepost: true,
          replyTo: { select: { id: true, author: true } },
          author: { select: { username: true, name: true, avatarUrl: true } },
          reposts: { where: { authorId: userId }, select: { createdAt: true } },
          likes: { where: { userId }, select: { createdAt: true } },
          _count: { select: { likes: true, reposts: true, replies: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return posts;
}

// Create User
export async function createUser({ email, username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateCode();

  return prisma.user.create({
    select: { id: true, email: true, confirmationCode: true },
    data: {
      email,
      username,
      confirmationCode,
      password: { create: { hash: hashedPassword } },
    },
  });
}

// Update User
export async function updateUser(newUserInfo) {
  const { id, name, bio, location, website, avatarUrl, coverUrl } = newUserInfo;

  return prisma.user.update({
    where: { id },
    data: {
      name,
      bio,
      location,
      website,
      avatarUrl,
      coverUrl,
    },
  });
}

// Delete User By Email
export async function deleteUser({ userId }) {
  return prisma.user.delete({ where: { id: userId } });
}

// Follow User
export async function followUser({ followerId, followedId }) {
  const follow = await prisma.follow.create({
    data: {
      followerId: followerId,
      followedId: followedId,
    },
  });

  return follow;
}

// Unfollow User
export async function unfollowUser({ followerId, followedId }) {
  return await prisma.follow.delete({
    where: { followerId_followedId: { followerId, followedId } },
  });
}
