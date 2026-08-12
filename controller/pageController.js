import path from "path";

export const getLogin = (req, res) => {
  const absoluteValue = path.resolve("./View/Html/login.html");
  res.sendFile(absoluteValue);
};

export const getRegister = (req, res) => {
  const absoluteValue = path.resolve("./View/Html/register.html");
  res.sendFile(absoluteValue);
};

export const getTodo = (req, res) => {
  const absoluteValue = path.resolve("./View/Html/todo.html");
  res.sendFile(absoluteValue);
};
