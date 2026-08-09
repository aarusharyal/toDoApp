import express from "express";
const app = express();

app.use(express.json());
app.use(express.static("View/JS"));
app.use(express.static("View/CSS"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export default app;
