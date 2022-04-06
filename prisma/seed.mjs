import bcrypt from "bcryptjs";
import prisma from "@prisma/client";

const { PrismaClient } = prisma;
const db = new PrismaClient();

async function seed() {
  // Cleanup the existing database
  await db.user.deleteMany({});
  await db.post.deleteMany({});
  await db.follow.deleteMany({});

  let mike = {
    name: "Mike Ehrmantraut",
    bio: "Security services",
    location: "Albuquerque",
    username: "mike",
    email: "mike@email.com",
    password: "password",
    avatarUrl:
      "https://www.indiewire.com/wp-content/uploads/2019/09/Jonathan-Banks-Mike-QA-1200x707.jpg",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Green_Grass.JPG/2560px-Green_Grass.JPG",
  };

  let saul = {
    name: "Saul Goodman",
    bio: "Hi. I’m Saul Goodman. Did you know that you have rights? The Constitution says you do. And so do I. I believe that until proven guilty, every man, woman, and child in this country is innocent. And that’s why I fight for you, Albuquerque! Better call Saul!",
    location: "Albuquerque",
    website: "http://saulgoodman.wix.com",
    username: "saulgoodman",
    email: "saul@email.com",
    password: "password",
    avatarUrl:
      "https://i.insider.com/54c8770469bedd234987fe1e?width=1136&format=jpeg",
    coverUrl:
      "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/03/better-call-saul.jpg",
  };

  const mikeUser = await db.user.create({
    data: {
      ...mike,
      password: { create: { hash: await bcrypt.hash(mike.password, 10) } },
    },
  });

  const saulUser = await db.user.create({
    data: {
      ...saul,
      password: { create: { hash: await bcrypt.hash(saul.password, 10) } },
    },
  });

  const followMike = await db.follow.create({
    data: {
      follower: { connect: { id: mikeUser.id } },
      followed: { connect: { id: saulUser.id } },
    },
  });

  const followSaul = await db.follow.create({
    data: {
      follower: { connect: { id: saulUser.id } },
      followed: { connect: { id: mikeUser.id } },
    },
  });

  const posts = [
    { body: "Hello World", authorId: saulUser.id },
    { body: "Hello again world?", authorId: saulUser.id },
    { body: "Whaats uuuup world", authorId: saulUser.id },
    { body: "Umm, ok", authorId: mikeUser.id },
    { body: "What is this even", authorId: mikeUser.id },
  ];

  posts.map(async (post) => {
    await db.post.create({
      data: {
        body: post.body,
        authorId: post.authorId,
      },
    });
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
