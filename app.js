import express from "express";
import { sessionMiddleware } from "./config/session.js";
import authRoutes from "./routes/authRouter.js";
import pageRoutes from "./routes/pageRouter.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("View/JS"));
app.use(express.static("View/CSS"));

app.use(sessionMiddleware);

app.use(authRoutes);
app.use(pageRoutes);

export default app;
