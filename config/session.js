import session from "express-session";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "myapp-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});
