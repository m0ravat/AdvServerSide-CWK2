const Account = require('../Models/accountModel');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates user with email and password, creates session.(Frontend Implementation - Login Form)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user WITH password
    const user = await Account.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Store session
    req.session.userId = user._id;

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email
      }
    });
    // Fallback error default in case of unexpected/out of bounds input.
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Destroys user session and clears session cookie (Frontend implementation - Delete Button that sends request)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Logout failed
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); // default session cookie name
    res.json({ message: 'Logged out successfully' });
  });
};

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the profile of the authenticated user (Frontend implementation - User page with basic account info and button to view profile)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await Account.findById(req.session.userId).populate('profile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     description: Creates a new user account and automatically logs them in. (Frontend implementation - Signup sheet)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Account with this email already exists
 *       500:
 *         description: Server error
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Account with this email already exists'
      });
    }

    const user = await Account.create({ email, password, fullname });

    // Store session immediately (auto-login after signup)
    req.session.userId = user._id;

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

