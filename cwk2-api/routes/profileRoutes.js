const express = require('express');
const profileRouter = express.Router();

const profileController = require('../Controller/profileController');
const { requireAlumni } = require('../Middleware/alumniMiddleware');

// All profile routes require user to be alumni
profileRouter.use(requireAlumni);

// Create profile
profileRouter.post('/', profileController.createProfile);

// Get current user's profile
profileRouter.get('/', profileController.getProfile);

// Update entire profile
profileRouter.put('/', profileController.updateProfile);

// Delete entire profile
profileRouter.delete('/', profileController.deleteProfile);

// Degrees
profileRouter.post('/degree', profileController.addDegree);
profileRouter.patch('/degree/:degreeId', profileController.updateDegree);
profileRouter.delete('/degree/:degreeId', profileController.removeDegree);

// Certifications
profileRouter.post('/certification', profileController.addCertification);
profileRouter.patch('/certification/:certificationId', profileController.updateCertification);
profileRouter.delete('/certification/:certificationId', profileController.removeCertification);

// Licenses
profileRouter.post('/license', profileController.addLicense);
profileRouter.patch('/license/:licenseId', profileController.updateLicense);
profileRouter.delete('/license/:licenseId', profileController.removeLicense);

// Courses
profileRouter.post('/course', profileController.addCourse);
profileRouter.patch('/course/:courseId', profileController.updateCourse);
profileRouter.delete('/course/:courseId', profileController.removeCourse);

// Employment History
profileRouter.post('/employment', profileController.addEmploymentHistory);
profileRouter.patch('/employment/:employmentId', profileController.updateEmploymentHistory);
profileRouter.delete('/employment/:employmentId', profileController.removeEmploymentHistory);

module.exports = profileRouter;
