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

exports.createProfile = async (req, res) => {
  try {
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
      ...req.body,
    });

    const completionPercentage = await calculateCompletionPercentage(profile);
    profile.profileCompletionPercentage = completionPercentage;

    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
};

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

exports.addDegree = async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOneAndUpdate(
      { account: userId },
      { $push: { degrees: req.body } },
      { new: true, runValidators: true }
    );

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
