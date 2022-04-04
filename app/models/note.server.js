import { prisma } from "~/db.server";

export function getNote({ id, userId }) {
  return prisma.note.findFirst({
    where: { id, userId },
  });
}

export function getNoteListItems({ userId }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({ body, title, userId }) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({ id, userId }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}
