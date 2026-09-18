import mongoose from "mongoose";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) throw new Error("MONGODB_URI is not configured.");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  mustChangePassword: { type: Boolean, default: true },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

const terminal = createInterface({ input, output });
const email = (await terminal.question("Admin email: ")).trim().toLowerCase();
const password = await terminal.question("Temporary password: ", {
  hideEchoBack: true,
});
terminal.close();

if (!email || password.length < 8)
  throw new Error("Use a valid email and a password of at least 8 characters.");
await mongoose.connect(mongoUri);
const existing = await User.findOne({ email });
if (existing) throw new Error("An account already exists with that email.");
await User.create({
  email,
  passwordHash: await hashPassword(password),
  role: "ADMIN",
  mustChangePassword: true,
});
await mongoose.disconnect();
console.log(
  `Admin account created for ${email}. Change the temporary password after the first login.`,
);
