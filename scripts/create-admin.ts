import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../lib/prisma";
import { emailSchema } from "../lib/validation";
async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const email = emailSchema.parse(await rl.question("Admin email: "));
  const name = (await rl.question("Admin name: ")).trim();
  rl.close();
  if (name.length < 2) throw new Error("Name must have at least 2 characters.");
  process.stdout.write("Admin password (hidden, at least 12 characters): ");
  const silent = new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });
  const prompt = createInterface({
    input: process.stdin,
    output: silent,
    terminal: true,
  });
  const password = await prompt.question("");
  prompt.close();
  process.stdout.write("\n");
  if (password.length < 12 || password.length > 128)
    throw new Error("Password must contain 12–128 characters.");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    throw new Error("That account already exists. No changes were made.");
  const id = randomUUID();
  const hashed = await hashPassword(password);
  await prisma.user.create({
    data: {
      id,
      email,
      name,
      emailVerified: true,
      role: "admin",
      accounts: {
        create: {
          id: randomUUID(),
          accountId: id,
          providerId: "credential",
          password: hashed,
        },
      },
    },
  });
  console.log("Admin created. Sign in at /admin/login.");
}
main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Admin creation failed.");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
