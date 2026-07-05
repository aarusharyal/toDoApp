const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const fs =require("fs");

const PORT = 3000;
app.use(express.static(path.join(__dirname,"Public")));

app.get("/",(req,res) =>
{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.listen(PORT,() =>
{
    console.log(`Server is running on http://localhost:${PORT}`);
});

