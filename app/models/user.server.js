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
  return prisma.follow.findUnique({
    where: { followerId_followedId: { followerId, followedId } },
  });
}

// Get User By Username
export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: { _count: { select: { follower: true, followed: true } } },
  });
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
export async function followUser(followerId, followedId) {
  const follow = await prisma.follow.create({
    data: {
      followerId: followerId,
      followedId: followedId,
    },
  });

  return follow;
}

// Unfollow User
export async function unfollowUser(followerId, followedId) {
  return await prisma.follow.delete({
    where: { followerId_followedId: { followerId, followedId } },
  });
}
