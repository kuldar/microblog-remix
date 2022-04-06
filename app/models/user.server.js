import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

// Get User By ID
export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// Get User By Email
export async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

// Is Following
export async function isFollowing({ followedId, followerId }) {
  if (!followedId || !followerId) return false;
  return prisma.follow.findUnique({
    where: { followerId_followedId: { followerId, followedId } },
  });
}

// Get User By Username
export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: {
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

// Get User Feed
export async function getUserFeed(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { followings: true },
  });

  let userIds = [userId];
  user.followings.map((follow) => userIds.push(follow.followedId));

  const posts = await prisma.post.findMany({
    where: { AND: [{ authorId: { in: userIds } }, { replyToId: null }] },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { username: true, name: true, avatarUrl: true } },
      reposts: { where: { authorId: userId }, select: { createdAt: true } },
      likes: { where: { userId }, select: { createdAt: true } },
      _count: { select: { likes: true, reposts: true, replies: true } },
      repost: {
        select: {
          id: true,
          body: true,
          createdAt: true,
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
export async function createUser(email, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
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
export async function deleteUserByEmail(email) {
  return prisma.user.delete({ where: { email } });
}

// Verify Login
export async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
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
