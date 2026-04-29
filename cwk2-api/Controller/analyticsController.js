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
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
