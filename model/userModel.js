import path from "path";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcrypt"; // For password hashing

const DATA_PATH = path.resolve("./model/data.json");

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

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
};

export const readUsers = () => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return [];
    }

    const rawData = fs.readFileSync(DATA_PATH, "utf-8").trim();
    if (!rawData) {
      return [];
    }

    const users = JSON.parse(rawData);

    // Validate data structure
    if (!Array.isArray(users)) {
      console.error("Users data is not an array");
      return [];
    }

    return users;
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
};

export const writeUsers = (users) => {
  try {
    // Validate input
    if (!Array.isArray(users)) {
      throw new Error("Users must be an array");
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
    console.log("Users file updated successfully");
  } catch (error) {
    console.error("Error writing users file:", error);
    throw new Error("Failed to save users");
  }
};

export const findUserByEmail = (users, email) => {
  if (!email || typeof email !== "string") {
    return undefined;
  }

  return users.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
  );
};

export const findUserByUsername = (users, username) => {
  if (!username || typeof username !== "string") {
    return undefined;
  }

  return users.find(
    (user) => user.username.toLowerCase() === username.trim().toLowerCase(),
  );
};

export const sanitizeUserData = (user) => {
  return {
    id: user.id,
    fullname: String(user.fullname || "").trim(),
    email: String(user.email || "")
      .trim()
      .toLowerCase(),
    username: String(user.username || "").trim(),
    password: user.password,
    createdAt: user.createdAt || new Date().toISOString(),
  };
};

export const validateUserRegistration = (
  fullname,
  email,
  username,
  password,
) => {
  // Validate fullname
  if (!fullname || typeof fullname !== "string") {
    return "Full name is required";
  }
  if (fullname.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }
  if (fullname.trim().length > 100) {
    return "Full name cannot exceed 100 characters";
  }

  // Validate email
  if (!email || typeof email !== "string") {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  // Validate username
  if (!username || typeof username !== "string") {
    return "Username is required";
  }
  if (username.trim().length < 3) {
    return "Username must be at least 3 characters";
  }
  if (username.trim().length > 30) {
    return "Username cannot exceed 30 characters";
  }
  // Username should only contain alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username.trim())) {
    return "Username can only contain letters, numbers, and underscores";
  }

  // Validate password
  if (!password || typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (password.length > 128) {
    return "Password cannot exceed 128 characters";
  }

  return null; // All valid
};
