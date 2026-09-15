import session from "express-session";
import fileStoreFactory from "session-file-store";
import crypto from "crypto";
// Import crypto because 'require' doesn't work in ES Modules

const FileStore = fileStoreFactory(session);

const fileStore = new FileStore({
  path: "./sessions",
  ttl: 24 * 60 * 60,
  reapInterval: 60 * 60, // Clean expired sessions every hour
  reapAsync: true,
  encoding: "utf8",
});

export const sessionMiddleware = session({
  store: fileStore,
  secret: process.env.SESSION_SECRET || "myapp-secret",
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
  // Custom cookie name
  genid: (req) => {
    // Generate cryptographically secure session IDs
    return crypto.randomBytes(16).toString("hex");
  },
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 24 * 60 * 1000,
    path: "/",
  },
});
