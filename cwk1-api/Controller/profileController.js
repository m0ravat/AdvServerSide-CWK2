const Profile = require('../Models/profileModel');
const { validationResult } = require('express-validator');

// Helper function to calculate completion percentage
const calculateCompletionPercentage = async (profile) => {
  let completedSections = 0;
  const totalSections = 8;

  if (profile.biography && profile.biography.trim().length > 0) completedSections++;
  if (profile.profileImage && profile.profileImage.filename) completedSections++;
  if (profile.linkedinUrl && profile.linkedinUrl.trim().length > 0) completedSections++;
  if (profile.degrees && profile.degrees.length > 0) completedSections++;
  if (profile.certifications && profile.certifications.length > 0) completedSections++;
  if (profile.licenses && profile.licenses.length > 0) completedSections++;
  if (profile.courses && profile.courses.length > 0) completedSections++;
  if (profile.employmentHistory && profile.employmentHistory.length > 0) completedSections++;

  return Math.round((completedSections / totalSections) * 100);
};

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create a new profile
 *     description: Creates a new user profile with optional initial data (Frontend implementation - Submit profile form with button pointing to this URL)
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               biography:
 *                 type: string
 *               linkedinUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Validation errors
 *       409:
 *         description: Profile already exists
 *       500:
 *         description: Error creating profile
 */
exports.createProfile = async (req, res) => {
  try {
    // Way of handling multiple errors since profile handles more data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.session.userId;

    const existingProfile = await Profile.findOne({ account: userId });
    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists for this account' });
    }

    const profile = new Profile({
      account: userId,
      ...req.body, // Frontend should validate form inputs, loss if person went around that is negligible since it's a basic CRUD app
    });

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;

    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  } // Fallback error message
};

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the authenticated user's profile (Frontend implementation - Form data shown)
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error retrieving profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOne({ account: userId }).populate('account');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the authenticated user's profile information (Frontend implementation - Update profile form)
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error updating profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete user profile
 *     description: Deletes the authenticated user's profile (Frontend implementation - Delete button asking if they are sure)
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error deleting profile
 */
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndDelete({ account: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/degree:
 *   post:
 *     summary: Add a degree
 *     description: Adds a new degree to the user's profile 
 *     tags: [Degrees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - institutionName
 *     responses:
 *       201:
 *         description: Degree added successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error adding degree
 */
exports.addDegree = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $push: { degrees: req.body } },
      { new: true, runValidators: true }
    ); // adds degree to array of degrees. 

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(201).json({ message: 'Degree added successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding degree', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/degree/{degreeId}:
 *   put:
 *     summary: Update a degree
 *     description: Updates a specific degree in the user's profile
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: degreeId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Degree updated successfully
 *       404:
 *         description: Profile or degree not found
 *       500:
 *         description: Error updating degree
 */
exports.updateDegree = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { degreeId } = req.params;
    const profile = await Profile.findOne({ account: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const degree = profile.degrees.id(degreeId);
    if (!degree) {
      return res.status(404).json({ message: 'Degree not found' });
    }

    Object.assign(degree, req.body);
    await profile.save();

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Degree updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating degree', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/degree/{degreeId}:
 *   delete:
 *     summary: Remove a degree
 *     description: Removes a specific degree from the user's profile
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: degreeId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Degree removed successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error removing degree
 */
exports.removeDegree = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { degreeId } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $pull: { degrees: { _id: degreeId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Degree removed successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error removing degree', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/certification:
 *   post:
 *     summary: Add a certification
 *     description: Adds a new certification to the user's profile
 *     tags: [Certifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Certification added successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error adding certification
 */
exports.addCertification = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $push: { certifications: req.body } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(201).json({ message: 'Certification added successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding certification', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/certification/{certificationId}:
 *   put:
 *     summary: Update a certification
 *     description: Updates a specific certification in the user's profile
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: certificationId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Certification updated successfully
 *       404:
 *         description: Profile or certification not found
 *       500:
 *         description: Error updating certification
 */
exports.updateCertification = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { certificationId } = req.params;
    const profile = await Profile.findOne({ account: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const certification = profile.certifications.id(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    Object.assign(certification, req.body);
    await profile.save();

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Certification updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating certification', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/certification/{certificationId}:
 *   delete:
 *     summary: Remove a certification
 *     description: Removes a specific certification from the user's profile
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: certificationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Certification removed successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error removing certification
 */
exports.removeCertification = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { certificationId } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $pull: { certifications: { _id: certificationId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Certification removed successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error removing certification', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/license:
 *   post:
 *     summary: Add a license
 *     description: Adds a new license to the user's profile
 *     tags: [Licenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: License added successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error adding license
 */
exports.addLicense = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $push: { licenses: req.body } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(201).json({ message: 'License added successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding license', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/license/{licenseId}:
 *   put:
 *     summary: Update a license
 *     description: Updates a specific license in the user's profile
 *     tags: [Licenses]
 *     parameters:
 *       - in: path
 *         name: licenseId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: License updated successfully
 *       404:
 *         description: Profile or license not found
 *       500:
 *         description: Error updating license
 */
exports.updateLicense = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { licenseId } = req.params;
    const profile = await Profile.findOne({ account: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const license = profile.licenses.id(licenseId);
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    Object.assign(license, req.body);
    await profile.save();

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'License updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating license', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/license/{licenseId}:
 *   delete:
 *     summary: Remove a license
 *     description: Removes a specific license from the user's profile
 *     tags: [Licenses]
 *     parameters:
 *       - in: path
 *         name: licenseId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: License removed successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error removing license
 */
exports.removeLicense = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { licenseId } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $pull: { licenses: { _id: licenseId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'License removed successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error removing license', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/course:
 *   post:
 *     summary: Add a course
 *     description: Adds a new course to the user's profile
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Course added successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error adding course
 */
exports.addCourse = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $push: { courses: req.body } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(201).json({ message: 'Course added successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/course/{courseId}:
 *   put:
 *     summary: Update a course
 *     description: Updates a specific course in the user's profile
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Profile or course not found
 *       500:
 *         description: Error updating course
 */
exports.updateCourse = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { courseId } = req.params;
    const profile = await Profile.findOne({ account: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const course = profile.courses.id(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    Object.assign(course, req.body);
    await profile.save();

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Course updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/course/{courseId}:
 *   delete:
 *     summary: Remove a course
 *     description: Removes a specific course from the user's profile
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Course removed successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error removing course
 */
exports.removeCourse = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { courseId } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $pull: { courses: { _id: courseId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Course removed successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error removing course', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/employment:
 *   post:
 *     summary: Add employment history
 *     description: Adds a new employment record to the user's profile
 *     tags: [Employment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Employment history added successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error adding employment history
 */
exports.addEmploymentHistory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $push: { employmentHistory: req.body } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(201).json({ message: 'Employment history added successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding employment history', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/employment/{employmentId}:
 *   put:
 *     summary: Update employment history
 *     description: Updates a specific employment record in the user's profile
 *     tags: [Employment]
 *     parameters:
 *       - in: path
 *         name: employmentId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Employment history updated successfully
 *       404:
 *         description: Profile or employment record not found
 *       500:
 *         description: Error updating employment history
 */
exports.updateEmploymentHistory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { employmentId } = req.params;
    const profile = await Profile.findOne({ account: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const employment = profile.employmentHistory.id(employmentId);
    if (!employment) {
      return res.status(404).json({ message: 'Employment history not found' });
    }

    Object.assign(employment, req.body);
    await profile.save();

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Employment history updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employment history', error: error.message });
  }
};

/**
 * @swagger
 * /api/profile/employment/{employmentId}:
 *   delete:
 *     summary: Remove employment history
 *     description: Removes a specific employment record from the user's profile
 *     tags: [Employment]
 *     parameters:
 *       - in: path
 *         name: employmentId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Employment history removed successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error removing employment history
 */
exports.removeEmploymentHistory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { employmentId } = req.params;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $pull: { employmentHistory: { _id: employmentId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;
    await profile.save();

    res.status(200).json({ message: 'Employment history removed successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error removing employment history', error: error.message });
  }
};