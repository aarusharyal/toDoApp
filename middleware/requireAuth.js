export const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }
  next();
};

export const requireAuthApi = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};
