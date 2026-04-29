const express = require('express');
const profileRouter = express.Router();

const profileController = require('../Controller/profileController');
const { requireAlumniAuth, requirePermission } = require('../Middleware/authMiddleware');

// All profile routes require user to be alumni with appropriate permissions
// Alumni have: read:profile, write:profile
// Non-alumni are denied access

// Apply alumni check to all routes
profileRouter.use(requireAlumniAuth);

// Read operations require read:profile permission
// Create profile
profileRouter.post('/', requirePermission('write:profile'), profileController.createProfile);

// Get current user's profile
profileRouter.get('/', requirePermission('read:profile'), profileController.getProfile);

// Update entire profile (requires write:profile)
profileRouter.put('/', requirePermission('write:profile'), profileController.updateProfile);

// Delete entire profile (requires write:profile)
profileRouter.delete('/', requirePermission('write:profile'), profileController.deleteProfile);

// Degrees - read requires read:profile, write operations require write:profile
profileRouter.post('/degree', requirePermission('write:profile'), profileController.addDegree);
profileRouter.patch('/degree/:degreeId', requirePermission('write:profile'), profileController.updateDegree);
profileRouter.delete('/degree/:degreeId', requirePermission('write:profile'), profileController.removeDegree);

// Certifications
profileRouter.post('/certification', requirePermission('write:profile'), profileController.addCertification);
profileRouter.patch('/certification/:certificationId', requirePermission('write:profile'), profileController.updateCertification);
profileRouter.delete('/certification/:certificationId', requirePermission('write:profile'), profileController.removeCertification);

// Licenses
profileRouter.post('/license', requirePermission('write:profile'), profileController.addLicense);
profileRouter.patch('/license/:licenseId', requirePermission('write:profile'), profileController.updateLicense);
profileRouter.delete('/license/:licenseId', requirePermission('write:profile'), profileController.removeLicense);

// Courses
profileRouter.post('/course', requirePermission('write:profile'), profileController.addCourse);
profileRouter.patch('/course/:courseId', requirePermission('write:profile'), profileController.updateCourse);
profileRouter.delete('/course/:courseId', requirePermission('write:profile'), profileController.removeCourse);

// Employment History
profileRouter.post('/employment', requirePermission('write:profile'), profileController.addEmploymentHistory);
profileRouter.patch('/employment/:employmentId', requirePermission('write:profile'), profileController.updateEmploymentHistory);
profileRouter.delete('/employment/:employmentId', requirePermission('write:profile'), profileController.removeEmploymentHistory);

module.exports = profileRouter;
