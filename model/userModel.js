import path from "path";
import fs from "fs";

const DATA_PATH = path.resolve("./model/data.json");

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
