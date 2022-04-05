import bcrypt from "bcryptjs";
import prisma from "@prisma/client";

const { PrismaClient } = prisma;
const db = new PrismaClient();

async function seed() {
  // Cleanup the existing database
  await db.user.deleteMany({});
  await db.post.deleteMany({});
  await db.follow.deleteMany({});

  let peter = {
    username: "peter",
    email: "peter@example.com",
    password: "password",
    hashedPassword: "",
  };

  let bob = {
    username: "bob",
    email: "bob@example.com",
    password: "password",
    hashedPassword: "",
  };

  peter.hashedPassword = await bcrypt.hash(peter.password, 10);
  bob.hashedPassword = await bcrypt.hash(bob.password, 10);

  const dbPeter = await db.user.create({
    data: {
      email: peter.email,
      username: peter.username,
      password: { create: { hash: peter.hashedPassword } },
    },
  });

  const dbBob = await db.user.create({
    data: {
      email: bob.email,
      username: bob.username,
      password: { create: { hash: bob.hashedPassword } },
    },
  });

  const posts = [
    { body: "Hello World", authorId: dbPeter.id },
    { body: "Hello again world?", authorId: dbPeter.id },
    { body: "Whaats uuuup world", authorId: dbPeter.id },
    { body: "Umm, ok", authorId: dbBob.id },
    { body: "What is this even", authorId: dbBob.id },
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
