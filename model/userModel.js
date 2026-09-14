import path from "path";
import fs from "fs";
import crypto from "crypto";

const DATA_PATH = path.resolve("./model/data.json");

// Generates a random 16-digit numeric string using Node's CSPRNG.
// The first digit is forced to 1-9 so the result is always exactly
// 16 digits long (never has a leading zero that would shorten it).
const generateRandomId = () => {
  let id = String(crypto.randomInt(1, 10));
  for (let i = 0; i < 15; i++) {
    id += String(crypto.randomInt(0, 10));
  }
  return id;
};

export const generateUniqueUserId = (users) => {
  const existingIds = new Set(users.map((user) => user.id));
  let id;
  do {
    id = generateRandomId();
  } while (existingIds.has(id));
  return id;
};

export const readUsers = () => {
  if (!fs.existsSync(DATA_PATH)) return [];

  const rawData = fs.readFileSync(DATA_PATH, "utf-8").trim();
  if (!rawData) return [];

  try {
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
};

export const writeUsers = (users) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
};

export const findUserByEmail = (users, email) =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase());
