import {
  readUsers,
  writeUsers,
  findUserByEmail,
  generateUniqueUserId,
  hashPassword,
  verifyPassword,
  validateUserRegistration,
} from "../model/userModel.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, username, password, confirmPassword } = req.body;

    // VALIDATION: Check all required fields
    const validationError = validateUserRegistration(
      fullname,
      email,
      username,
      password,
    );

    if (validationError) {
      console.log("Registration validation failed:", validationError);
      return res.redirect(
        `/register?error=${encodeURIComponent(validationError)}`,
      );
    }

    // VALIDATION: Confirm passwords match
    if (password !== confirmPassword) {
      return res.redirect("/register?error=PasswordsDoNotMatch");
    }

    // Read existing users
    const users = readUsers();

    // SECURITY: Check if email already exists
    if (findUserByEmail(users, email)) {
      console.log("Registration failed: Email already exists:", email);
      return res.redirect("/register?error=EmailAlreadyExists");
    }

    // SECURITY: Check if username already exists
    const existingUsername = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (existingUsername) {
      console.log("Registration failed: Username already exists:", username);
      return res.redirect("/register?error=UsernameAlreadyExists");
    }

    // Generate unique user ID
    const id = generateUniqueUserId(users);

    // This is async, so we need await
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.redirect("/register?error=RegistrationFailed");
    }

    // Create new user object with hashed password
    const newUser = {
      id,
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Save user
    users.push(newUser);
    writeUsers(users);

    console.log("User registered successfully:", newUser.email);

    // Redirect to login with success message
    return res.redirect("/login?registered=true");
  } catch (error) {
    console.error("Registration error:", error);
    return res.redirect("/register?error=InternalError");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION: Check required fields
    if (!email || typeof email !== "string") {
      return res.redirect("/login?error=EmailRequired");
    }

    if (!password || typeof password !== "string") {
      return res.redirect("/login?error=PasswordRequired");
    }

    const users = readUsers();

    // Find user by email
    const user = findUserByEmail(users, email);

    if (!user) {
      console.log(" Login failed: User not found:", email);
      return res.redirect("/login?error=InvalidCredentials");
    }

    // This is async, so we need await
    let passwordMatch;
    try {
      passwordMatch = await verifyPassword(password, user.password);
    } catch (verifyError) {
      console.error("Error verifying password:", verifyError);
      return res.redirect("/login?error=AuthenticationFailed");
    }

    if (!passwordMatch) {
      console.log("Login failed: Invalid password for user:", email);
      return res.redirect("/login?error=InvalidCredentials");
    }

    // SECURITY: Regenerate session ID after login (prevent session fixation)
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        return res.redirect("/login?error=SessionError");
      }

      // Set user in session (don't include password)
      req.session.user = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
      };

      // Save session to store (FileStore in this case)
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
          return res.redirect("/login?error=SessionError");
        }

        console.log("User logged in successfully:", user.email);

        // Redirect to dashboard
        return res.redirect("/dashboard");
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.redirect("/login?error=InternalError");
  }
};

export const getSession = (req, res) => {
  try {
    if (req.session?.user?.username) {
      return res.json({
        authenticated: true,
        user: {
          id: req.session.user.id,
          username: req.session.user.username,
          email: req.session.user.email,
          fullname: req.session.user.fullname,
        },
      });
    }

    return res.status(401).json({
      authenticated: false,
      message: "Not authenticated",
    });
  } catch (error) {
    console.error("Session check error:", error);
    return res.status(500).json({
      error: "Session check failed",
    });
  }
};

export const logout = (req, res) => {
  try {
    if (req.session) {
      const userEmail = req.session.user?.email;

      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.redirect("/login?error=LogoutFailed");
        }

        console.log("User logged out successfully:", userEmail);

        // Clear session cookie
        res.clearCookie("sessionId");
        // Use your actual session cookie name

        // Redirect to login
        return res.redirect("/login?loggedOut=true");
      });
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.redirect("/login?error=InternalError");
  }
};
