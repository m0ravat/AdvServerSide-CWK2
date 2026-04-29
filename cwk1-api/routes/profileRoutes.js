const express = require('express');
const profileRouter = express.Router();

const profileController = require('../Controller/profileController');

// ==========================
// CORE PROFILE ROUTES
// patch - Update one object
// Delete - Remove entire schema model or object (depends on route)
// put - Update entire schema model
// ==========================

// Create profile
profileRouter.post('/', profileController.createProfile);

// Get current user's profile
profileRouter.get('/',  profileController.getProfile);

// Update entire profile
profileRouter.put('/',  profileController.updateProfile);

// Delete entire profile
profileRouter.delete('/',  profileController.deleteProfile);



// ==========================
// DEGREES
// ==========================

profileRouter.patch('/degrees/:degreeId',  profileController.updateDegree);
profileRouter.delete('/degrees/:degreeId', profileController.removeDegree);


// ==========================
// CERTIFICATIONS
// ==========================

profileRouter.patch('/certifications/:certificationId', profileController.updateCertification);
profileRouter.delete('/certifications/:certificationId', profileController.removeCertification);


// ==========================
// LICENSES
// ==========================

profileRouter.patch('/licenses/:licenseId', profileController.updateLicense);
profileRouter.delete('/licenses/:licenseId', profileController.removeLicense);


// ==========================
// COURSES
// ==========================

profileRouter.patch('/courses/:courseId', profileController.updateCourse);
profileRouter.delete('/courses/:courseId', profileController.removeCourse);


// ==========================
// EMPLOYMENT HISTORY
// ==========================

profileRouter.patch('/employment/:employmentId', profileController.updateEmploymentHistory);
profileRouter.delete('/employment/:employmentId', profileController.removeEmploymentHistory);


module.exports = profileRouter;