import { PrismaClient } from "@prisma/client";

let prisma;
let isProduction = process.env.NODE_ENV === "production";

// Prevent a new connection to the database
// happening with every local code change
if (isProduction) {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) global.__db__ = new PrismaClient();
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };
