import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
// import fs from "node:fs";
// import path from "node:path";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  // ssl: {
  //   ca: fs.readFileSync(
  //     path.join(process.cwd(), "certs", "isrgrootx1.pem"),
  //     "utf8",
  //   ),
  // },
  ssl: {
    ca: process.env.DATABASE_CA_CERT,
  },
});

const prisma = new PrismaClient({ adapter });

export { prisma };
