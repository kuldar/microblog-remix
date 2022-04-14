import bcrypt from "bcryptjs";
import prisma from "@prisma/client";

const { PrismaClient } = prisma;
const db = new PrismaClient();

async function seed() {
  // Cleanup the existing database
  await db.follow.deleteMany({}).catch(() => {});
  await db.postLike.deleteMany({}).catch(() => {});
  await db.post.deleteMany({}).catch(() => {});
  await db.password.deleteMany({}).catch(() => {});
  await db.user.deleteMany({}).catch(() => {});

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
      "https://images-na.ssl-images-amazon.com/images/I/51Bm5oN1MLL.jpg",
    coverUrl:
      "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/03/better-call-saul.jpg",
  };

  let lalo = {
    name: "Lalo Salamanca",
    bio: "Ah, I'm just here to lend a helping hand, you know, make sure the business is running in order. I got a good head for numbers. But listen, don't even worry. It's gonna be like I'm not even here.",
    location: "El Michoacáno",
    username: "lalosalamanca",
    email: "lalo@email.com",
    password: "password",
    avatarUrl:
      "https://yt3.ggpht.com/fIMKokCsjyyYikaXe4qX4FH7TkKhoWa4Vevf3FG8OlEU89Ge08R0bPorQCOpVN0BRC3417zFrg=s900-c-k-c0x00ffffff-no-rj",
    coverUrl:
      "https://www.breakingbad-locations.com/wp-content/uploads/2017/06/better.call_.saul_.s03e08.convert.1080p.web_.h264-tbs.mkv_001979132.png",
  };

  const mikeUser = await db.user.create({
    data: {
      ...mike,
      status: "verified",
      password: { create: { hash: await bcrypt.hash(mike.password, 10) } },
    },
  });

  const saulUser = await db.user.create({
    data: {
      ...saul,
      status: "active",
      password: { create: { hash: await bcrypt.hash(saul.password, 10) } },
    },
  });

  const laloUser = await db.user.create({
    data: {
      ...lalo,
      status: "active",
      password: { create: { hash: await bcrypt.hash(lalo.password, 10) } },
    },
  });

  const mikeFollowSaul = await db.follow.create({
    data: {
      follower: { connect: { id: mikeUser.id } },
      followed: { connect: { id: saulUser.id } },
    },
  });

  const saulFollowMike = await db.follow.create({
    data: {
      follower: { connect: { id: saulUser.id } },
      followed: { connect: { id: mikeUser.id } },
    },
  });

  const laloFollowMike = await db.follow.create({
    data: {
      follower: { connect: { id: laloUser.id } },
      followed: { connect: { id: mikeUser.id } },
    },
  });

  const laloFollowSaul = await db.follow.create({
    data: {
      follower: { connect: { id: laloUser.id } },
      followed: { connect: { id: saulUser.id } },
    },
  });

  const posts = [
    {
      body: "Sometimes you have to say something out loud to hear how crazy it sounds.",
      authorId: saulUser.id,
    },
    {
      body: "What’s the difference between a tick and a lawyer? The tick falls off when you’re dead!",
      authorId: saulUser.id,
    },
    {
      body: "We all make our choices. And those choices, they put us on a road. Sometimes those choices seem small, but they put you on the road. You think about getting off. But eventually, you’re back on it.",
      authorId: mikeUser.id,
    },
    {
      body: "Why do they bury lawyers under 20 feet of dirt? Because deep down, they’re really good people.",
      authorId: saulUser.id,
    },
    {
      body: "You are not the guy. You’re not capable of being the guy. I had a guy, but now I don’t. You are not the guy.",
      authorId: mikeUser.id,
    },
    {
      body: "I just want to hear the story.",
      authorId: laloUser.id,
    },
    {
      body: "La familia es todo.",
      authorId: laloUser.id,
    },
  ];

  const dbPosts = posts.map(async (post) => {
    await db.post.create({
      data: {
        body: post.body,
        authorId: post.authorId,
      },
    });
  });

  const post1 = await db.post.create({
    data: {
      body: "Perfection is the enemy of perfectly adequate.",
      authorId: saulUser.id,
    },
  });

  const post1Repost = await db.post.create({
    data: {
      isRepost: true,
      repostId: post1.id,
      authorId: mikeUser.id,
    },
  });

  const postLike1 = await db.postLike.create({
    data: {
      postId: post1.id,
      userId: laloUser.id,
    },
  });

  const postLike2 = await db.postLike.create({
    data: {
      postId: post1.id,
      userId: mikeUser.id,
    },
  });

  const post1Reply = await db.post.create({
    data: {
      replyToId: post1.id,
      authorId: mikeUser.id,
      isReply: true,
      body: "Well I don't know about that..",
    },
  });

  const postLike3 = await db.postLike.create({
    data: {
      postId: post1Reply.id,
      userId: saulUser.id,
    },
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
