import { readUsers, writeUsers, findUserByEmail } from "../model/userModel.js";

export const register = (req, res) => {
  const { fullname, email, username, password } = req.body;
  const users = readUsers();

  if (findUserByEmail(users, email)) {
    return res.redirect("/register?error=EmailAlreadyExists");
  }

  users.push({ fullname, email, username, password });
  writeUsers(users);

  res.redirect("/login?registered=true");
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (user) {
    req.session.user = {
      fullname: user.fullname,
      email: user.email,
      username: user.username,
    };

    return req.session.save(() => {
      res.redirect("/dashboard");
    });
  }

  return res.redirect("/login?error=InvalidCredentials");
};

export const getSession = (req, res) => {
  if (req.session?.user?.username) {
    return res.json({ username: req.session.user.username });
  }

  return res.status(401).json({ message: "Not authenticated" });
};

export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  } else {
    res.redirect("/login");
  }
};
