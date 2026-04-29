const Profile = require('../Models/profileModel');

exports.getAnalytics = async (req, res) => {
  try {
    const profiles = await Profile.find();

    // Employment stats
    const employed = profiles.filter(p => p.employed === true).length;
    const notEmployed = profiles.filter(p => p.employed === false).length;

    // LinkedIn stats
    const hasLinkedIn = profiles.filter(p => p.linkedinUrl).length;
    const noLinkedIn = profiles.length - hasLinkedIn;

    // Degree stats
    const noDegrees = profiles.filter(p => p.degrees.length === 0).length;
    const oneDegree = profiles.filter(p => p.degrees.length === 1).length;
    const twoDegrees = profiles.filter(p => p.degrees.length === 2).length;
    const threePlusDegrees = profiles.filter(p => p.degrees.length >= 3).length;

    // Time to find job (in days)
    const DAY_MS = 24 * 60 * 60 * 1000;
    const thirtyDays = 30 * DAY_MS;
    const sixMonths = 180 * DAY_MS;
    const oneYear = 365 * DAY_MS;
    const twoYears = 730 * DAY_MS;
    const fiveYears = 1825 * DAY_MS;

    const timeToJobStats = {
      thirtyDaysOrLess: profiles.filter(
        p => p.timeToFindJob && p.timeToFindJob <= thirtyDays
      ).length,
      thirtyDaysToSixMonths: profiles.filter(
        p => p.timeToFindJob && p.timeToFindJob > thirtyDays && p.timeToFindJob <= sixMonths
      ).length,
      sixMonthsToOneYear: profiles.filter(
        p => p.timeToFindJob && p.timeToFindJob > sixMonths && p.timeToFindJob <= oneYear
      ).length,
      oneYearToTwoYears: profiles.filter(
        p => p.timeToFindJob && p.timeToFindJob > oneYear && p.timeToFindJob <= twoYears
      ).length,
      twoYearsToFiveYears: profiles.filter(
        p => p.timeToFindJob && p.timeToFindJob > twoYears && p.timeToFindJob <= fiveYears
      ).length,
      fiveYearsPlus: profiles.filter(
        p => p.timeToFindJob && p.timeToFindJob > fiveYears
      ).length,
    };

    // Location stats
    const locationStats = {
      London: profiles.filter(p => p.location === 'London').length,
      England: profiles.filter(p => p.location === 'England').length,
      UK: profiles.filter(p => p.location === 'UK').length,
      Scotland: profiles.filter(p => p.location === 'Scotland').length,
      Ireland: profiles.filter(p => p.location === 'Ireland').length,
      Asia: profiles.filter(p => p.location === 'Asia').length,
      Africa: profiles.filter(p => p.location === 'Africa').length,
      SouthAmerica: profiles.filter(p => p.location === 'South America').length,
      NorthAmerica: profiles.filter(p => p.location === 'North America').length,
      Europe: profiles.filter(p => p.location === 'Europe').length,
    };

    // Certifications, Courses, Licenses combined stats
    const totalCredentialsPerProfile = profiles.map(
      p => p.certifications.length + p.courses.length + p.licenses.length
    );

    const noCertifications = totalCredentialsPerProfile.filter(c => c === 0).length;
    const oneToFiveCertifications = totalCredentialsPerProfile.filter(c => c >= 1 && c <= 5).length;
    const sixToTenCertifications = totalCredentialsPerProfile.filter(c => c >= 6 && c <= 10).length;
    const tenPlusCertifications = totalCredentialsPerProfile.filter(c => c > 10).length;

    // Degree-specific analytics
    const allDegrees = profiles.flatMap(p => p.degrees);
    
    // Degree type breakdown
    const degreeTypeStats = {
      bachelor: allDegrees.filter(d => d.degreeType === 'Bachelor').length,
      master: allDegrees.filter(d => d.degreeType === 'Master').length,
      phd: allDegrees.filter(d => d.degreeType === 'PhD').length,
      diploma: allDegrees.filter(d => d.degreeType === 'Diploma').length,
      certificate: allDegrees.filter(d => d.degreeType === 'Certificate').length,
    };

    // Degrees completed by year (2015-2025)
    const degreesByYear = {};
    for (let year = 2015; year <= 2025; year++) {
      degreesByYear[year] = allDegrees.filter(d => {
        const completionYear = new Date(d.completionDate).getFullYear();
        return completionYear === year;
      }).length;
    }

    // Top 10 fields of study
    const fieldOfStudyMap = {};
    allDegrees.forEach(d => {
      const field = d.fieldOfStudy;
      fieldOfStudyMap[field] = (fieldOfStudyMap[field] || 0) + 1;
    });

    const top10Fields = Object.entries(fieldOfStudyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([field, count]) => ({ field, count }));

    // Certification-specific analytics
    const allCertifications = profiles.flatMap(p => p.certifications);

    // Top 5 issuing organizations
    const organizationMap = {};
    allCertifications.forEach(c => {
      const org = c.issuingOrganization;
      organizationMap[org] = (organizationMap[org] || 0) + 1;
    });

    const top5Organizations = Object.entries(organizationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([org, count]) => ({ organization: org, count }));

    // Certifications by year (2015-2025)
    const certificationsByYear = {};
    for (let year = 2015; year <= 2025; year++) {
      certificationsByYear[year] = allCertifications.filter(c => {
        const completionYear = new Date(c.completionDate).getFullYear();
        return completionYear === year;
      }).length;
    }

    // Certifications by month in 2026
    const certificationsByMonth2026 = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    allCertifications.forEach(c => {
      const completionDate = new Date(c.completionDate);
      if (completionDate.getFullYear() === 2026) {
        const monthIndex = completionDate.getMonth();
        certificationsByMonth2026[months[monthIndex]]++;
      }
    });

    // Certification type breakdown
    const certTypeStats = {
      Cloud: allCertifications.filter(c => c.typeOfCert === 'Cloud').length,
      DevOps: allCertifications.filter(c => c.typeOfCert === 'DevOps').length,
      SoftwareDevelopment: allCertifications.filter(c => c.typeOfCert === 'Software Development').length,
      DataScience: allCertifications.filter(c => c.typeOfCert === 'Data Science').length,
      ProjectManagement: allCertifications.filter(c => c.typeOfCert === 'Project Management').length,
      Testing: allCertifications.filter(c => c.typeOfCert === 'Testing').length,
      Other: allCertifications.filter(c => c.typeOfCert === 'Other').length,
    };

    // Certifications related to degree
    const relatedToDegree = allCertifications.filter(c => c.relatedToDegree === true).length;
    const notRelatedToDegree = allCertifications.length - relatedToDegree;

    // License-specific analytics
    const allLicenses = profiles.flatMap(p => p.licenses);

    // Top 5 issuing bodies for licenses
    const issuingBodyMap = {};
    allLicenses.forEach(l => {
      const body = l.issuingBody;
      issuingBodyMap[body] = (issuingBodyMap[body] || 0) + 1;
    });

    const top5IssuingBodies = Object.entries(issuingBodyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([body, count]) => ({ issuingBody: body, count }));

    // Licenses issued by year (2015-2025)
    const licensesByYear = {};
    for (let year = 2015; year <= 2025; year++) {
      licensesByYear[year] = allLicenses.filter(l => {
        const issueYear = new Date(l.issueDate).getFullYear();
        return issueYear === year;
      }).length;
    }

    // Licenses issued by month in 2026
    const licensesByMonth2026 = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    allLicenses.forEach(l => {
      const issueDate = new Date(l.issueDate);
      if (issueDate.getFullYear() === 2026) {
        const monthIndex = issueDate.getMonth();
        licensesByMonth2026[months[monthIndex]]++;
      }
    });

    // License type breakdown - using licenseName as type indicator
    const licenseTypeMap = {};
    allLicenses.forEach(l => {
      const type = l.licenseName;
      licenseTypeMap[type] = (licenseTypeMap[type] || 0) + 1;
    });

    const licenseTypeBreakdown = Object.entries(licenseTypeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ licenseType: type, count }));

    // Licenses related to degree
    const licensesRelatedToDegree = allLicenses.filter(l => l.relatedToDegree === true).length;
    const licensesNotRelatedToDegree = allLicenses.length - licensesRelatedToDegree;

    // Course-specific analytics
    const allCourses = profiles.flatMap(p => p.courses);

    // Top 5 course providers
    const providerMap = {};
    allCourses.forEach(c => {
      const provider = c.provider;
      providerMap[provider] = (providerMap[provider] || 0) + 1;
    });

    const top5Providers = Object.entries(providerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([provider, count]) => ({ provider, count }));

    // Courses completed by year (2015-2025)
    const coursesByYear = {};
    for (let year = 2015; year <= 2025; year++) {
      coursesByYear[year] = allCourses.filter(c => {
        if (!c.completionDate) return false;
        const completionYear = new Date(c.completionDate).getFullYear();
        return completionYear === year;
      }).length;
    }

    // Courses completed by month in 2026
    const coursesByMonth2026 = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    allCourses.forEach(c => {
      if (!c.completionDate) return;
      const completionDate = new Date(c.completionDate);
      if (completionDate.getFullYear() === 2026) {
        const monthIndex = completionDate.getMonth();
        coursesByMonth2026[months[monthIndex]]++;
      }
    });

    // Courses related to degree
    const coursesRelatedToDegree = allCourses.filter(c => c.relatedToDegree === true).length;
    const coursesNotRelatedToDegree = allCourses.length - coursesRelatedToDegree;

    const analytics = {
      totalProfiles: profiles.length,
      employment: {
        employed,
        notEmployed,
      },
      linkedIn: {
        hasLinkedIn,
        noLinkedIn,
      },
      degrees: {
        noDegrees,
        oneDegree,
        twoDegrees,
        threePlusDegrees,
      },
      timeToFindJob: timeToJobStats,
      locations: locationStats,
      credentials: {
        noCertifications,
        oneToFiveCertifications,
        sixToTenCertifications,
        tenPlusCertifications,
      },
      degreeAnalytics: {
        degreeTypeBreakdown: degreeTypeStats,
        degreesByYear,
        topFieldsOfStudy: top10Fields,
      },
      certificationAnalytics: {
        top5Organizations,
        certificationsByYear,
        certificationsByMonth2026,
        certificationTypeBreakdown: certTypeStats,
        relatedToDegree,
        notRelatedToDegree,
        totalCertifications: allCertifications.length,
      },
      licenseAnalytics: {
        top5IssuingBodies,
        licensesByYear,
        licensesByMonth2026,
        licenseTypeBreakdown,
        relatedToDegree: licensesRelatedToDegree,
        notRelatedToDegree: licensesNotRelatedToDegree,
        totalLicenses: allLicenses.length,
      },
      courseAnalytics: {
        top5Providers,
        coursesByYear,
        coursesByMonth2026,
        relatedToDegree: coursesRelatedToDegree,
        notRelatedToDegree: coursesNotRelatedToDegree,
        totalCourses: allCourses.length,
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
