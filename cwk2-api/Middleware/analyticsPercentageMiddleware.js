// Helper function to calculate percentage as whole number
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Middleware to add percentages to analytics data
exports.addAnalyticsPercentages = (analyticsData) => {
  const total = analyticsData.totalProfiles;
  const analytics = { ...analyticsData };

  // Employment percentages
  analytics.employment.employedPercentage = calculatePercentage(analytics.employment.employed, total);
  analytics.employment.notEmployedPercentage = calculatePercentage(analytics.employment.notEmployed, total);

  // LinkedIn percentages
  analytics.linkedIn.hasLinkedInPercentage = calculatePercentage(analytics.linkedIn.hasLinkedIn, total);
  analytics.linkedIn.noLinkedInPercentage = calculatePercentage(analytics.linkedIn.noLinkedIn, total);

  // Degrees percentages
  analytics.degrees.noDegreesPercentage = calculatePercentage(analytics.degrees.noDegrees, total);
  analytics.degrees.oneDegreePercentage = calculatePercentage(analytics.degrees.oneDegree, total);
  analytics.degrees.twoDegreesPercentage = calculatePercentage(analytics.degrees.twoDegrees, total);
  analytics.degrees.threePlusDegreesPercentage = calculatePercentage(analytics.degrees.threePlusDegrees, total);

  // Time to find job percentages
  const totalWithTimeData = Object.values(analytics.timeToFindJob).reduce((a, b) => a + b, 0);
  analytics.timeToFindJob.thirtyDaysOrLessPercentage = calculatePercentage(analytics.timeToFindJob.thirtyDaysOrLess, totalWithTimeData);
  analytics.timeToFindJob.thirtyDaysToSixMonthsPercentage = calculatePercentage(analytics.timeToFindJob.thirtyDaysToSixMonths, totalWithTimeData);
  analytics.timeToFindJob.sixMonthsToOneYearPercentage = calculatePercentage(analytics.timeToFindJob.sixMonthsToOneYear, totalWithTimeData);
  analytics.timeToFindJob.oneYearToTwoYearsPercentage = calculatePercentage(analytics.timeToFindJob.oneYearToTwoYears, totalWithTimeData);
  analytics.timeToFindJob.twoYearsToFiveYearsPercentage = calculatePercentage(analytics.timeToFindJob.twoYearsToFiveYears, totalWithTimeData);
  analytics.timeToFindJob.fiveYearsPlusPercentage = calculatePercentage(analytics.timeToFindJob.fiveYearsPlus, totalWithTimeData);

  // Location percentages
  const totalLocations = Object.values(analytics.locations).reduce((a, b) => a + b, 0);
  Object.keys(analytics.locations).forEach(location => {
    const key = location.charAt(0).toUpperCase() + location.slice(1);
    analytics.locations[`${location}Percentage`] = calculatePercentage(analytics.locations[location], totalLocations);
  });

  // Credentials percentages
  const totalWithCredentials = Object.values(analytics.credentials).reduce((a, b) => a + b, 0);
  analytics.credentials.noCertificationsPercentage = calculatePercentage(analytics.credentials.noCertifications, total);
  analytics.credentials.oneToFiveCertificationsPercentage = calculatePercentage(analytics.credentials.oneToFiveCertifications, total);
  analytics.credentials.sixToTenCertificationsPercentage = calculatePercentage(analytics.credentials.sixToTenCertifications, total);
  analytics.credentials.tenPlusCertificationsPercentage = calculatePercentage(analytics.credentials.tenPlusCertifications, total);

  // Degree analytics percentages
  const totalDegrees = Object.values(analytics.degreeAnalytics.degreeTypeBreakdown).reduce((a, b) => a + b, 0);
  Object.keys(analytics.degreeAnalytics.degreeTypeBreakdown).forEach(type => {
    analytics.degreeAnalytics.degreeTypeBreakdown[`${type}Percentage`] = calculatePercentage(
      analytics.degreeAnalytics.degreeTypeBreakdown[type],
      totalDegrees
    );
  });

  // Degrees by year percentages
  Object.keys(analytics.degreeAnalytics.degreesByYear).forEach(year => {
    analytics.degreeAnalytics.degreesByYear[`${year}Percentage`] = calculatePercentage(
      analytics.degreeAnalytics.degreesByYear[year],
      totalDegrees
    );
  });

  // Top fields of study percentages
  analytics.degreeAnalytics.topFieldsOfStudy.forEach(field => {
    field.percentage = calculatePercentage(field.count, totalDegrees);
  });

  // Certification analytics percentages
  const totalCerts = analytics.certificationAnalytics.totalCertifications;
  
  analytics.certificationAnalytics.top5Organizations.forEach(org => {
    org.percentage = calculatePercentage(org.count, totalCerts);
  });

  Object.keys(analytics.certificationAnalytics.certificationsByYear).forEach(year => {
    analytics.certificationAnalytics.certificationsByYear[`${year}Percentage`] = calculatePercentage(
      analytics.certificationAnalytics.certificationsByYear[year],
      totalCerts
    );
  });

  Object.keys(analytics.certificationAnalytics.certificationsByMonth2026).forEach(month => {
    analytics.certificationAnalytics.certificationsByMonth2026[`${month}Percentage`] = calculatePercentage(
      analytics.certificationAnalytics.certificationsByMonth2026[month],
      totalCerts
    );
  });

  Object.keys(analytics.certificationAnalytics.certificationTypeBreakdown).forEach(type => {
    analytics.certificationAnalytics.certificationTypeBreakdown[`${type}Percentage`] = calculatePercentage(
      analytics.certificationAnalytics.certificationTypeBreakdown[type],
      totalCerts
    );
  });

  analytics.certificationAnalytics.relatedToDegreePercentage = calculatePercentage(
    analytics.certificationAnalytics.relatedToDegree,
    totalCerts
  );
  analytics.certificationAnalytics.notRelatedToDegreePercentage = calculatePercentage(
    analytics.certificationAnalytics.notRelatedToDegree,
    totalCerts
  );

  // License analytics percentages
  const totalLicenses = analytics.licenseAnalytics.totalLicenses;

  analytics.licenseAnalytics.top5IssuingBodies.forEach(body => {
    body.percentage = calculatePercentage(body.count, totalLicenses);
  });

  Object.keys(analytics.licenseAnalytics.licensesByYear).forEach(year => {
    analytics.licenseAnalytics.licensesByYear[`${year}Percentage`] = calculatePercentage(
      analytics.licenseAnalytics.licensesByYear[year],
      totalLicenses
    );
  });

  Object.keys(analytics.licenseAnalytics.licensesByMonth2026).forEach(month => {
    analytics.licenseAnalytics.licensesByMonth2026[`${month}Percentage`] = calculatePercentage(
      analytics.licenseAnalytics.licensesByMonth2026[month],
      totalLicenses
    );
  });

  analytics.licenseAnalytics.licenseTypeBreakdown.forEach(license => {
    license.percentage = calculatePercentage(license.count, totalLicenses);
  });

  analytics.licenseAnalytics.relatedToDegreePercentage = calculatePercentage(
    analytics.licenseAnalytics.relatedToDegree,
    totalLicenses
  );
  analytics.licenseAnalytics.notRelatedToDegreePercentage = calculatePercentage(
    analytics.licenseAnalytics.notRelatedToDegree,
    totalLicenses
  );

  // Course analytics percentages
  const totalCourses = analytics.courseAnalytics.totalCourses;

  analytics.courseAnalytics.top5Providers.forEach(provider => {
    provider.percentage = calculatePercentage(provider.count, totalCourses);
  });

  Object.keys(analytics.courseAnalytics.coursesByYear).forEach(year => {
    analytics.courseAnalytics.coursesByYear[`${year}Percentage`] = calculatePercentage(
      analytics.courseAnalytics.coursesByYear[year],
      totalCourses
    );
  });

  Object.keys(analytics.courseAnalytics.coursesByMonth2026).forEach(month => {
    analytics.courseAnalytics.coursesByMonth2026[`${month}Percentage`] = calculatePercentage(
      analytics.courseAnalytics.coursesByMonth2026[month],
      totalCourses
    );
  });

  analytics.courseAnalytics.relatedToDegreePercentage = calculatePercentage(
    analytics.courseAnalytics.relatedToDegree,
    totalCourses
  );
  analytics.courseAnalytics.notRelatedToDegreePercentage = calculatePercentage(
    analytics.courseAnalytics.notRelatedToDegree,
    totalCourses
  );

  // Employment history analytics percentages
  const totalJobs = analytics.employmentHistoryAnalytics.totalJobs;

  // Jobs per profile percentages
  analytics.employmentHistoryAnalytics.jobsPerProfile.oneJobPercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.jobsPerProfile.oneJob,
    total
  );
  analytics.employmentHistoryAnalytics.jobsPerProfile.oneToThreeJobsPercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.jobsPerProfile.oneToThreeJobs,
    total
  );
  analytics.employmentHistoryAnalytics.jobsPerProfile.threeToFiveJobsPercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.jobsPerProfile.threeToFiveJobs,
    total
  );
  analytics.employmentHistoryAnalytics.jobsPerProfile.fiveToNineJobsPercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.jobsPerProfile.fiveToNineJobs,
    total
  );
  analytics.employmentHistoryAnalytics.jobsPerProfile.tenPlusJobsPercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.jobsPerProfile.tenPlusJobs,
    total
  );

  // Top companies percentages
  analytics.employmentHistoryAnalytics.top5Companies.forEach(company => {
    company.percentage = calculatePercentage(company.count, totalJobs);
  });

  // Job starts by year percentages
  Object.keys(analytics.employmentHistoryAnalytics.jobStartsByYear).forEach(year => {
    analytics.employmentHistoryAnalytics.jobStartsByYear[`${year}Percentage`] = calculatePercentage(
      analytics.employmentHistoryAnalytics.jobStartsByYear[year],
      totalJobs
    );
  });

  // Job starts by month 2026 percentages
  Object.keys(analytics.employmentHistoryAnalytics.jobStartsByMonth2026).forEach(month => {
    analytics.employmentHistoryAnalytics.jobStartsByMonth2026[`${month}Percentage`] = calculatePercentage(
      analytics.employmentHistoryAnalytics.jobStartsByMonth2026[month],
      totalJobs
    );
  });

  // Jobs related to degree percentages
  analytics.employmentHistoryAnalytics.relatedToDegreePercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.relatedToDegree,
    totalJobs
  );
  analytics.employmentHistoryAnalytics.notRelatedToDegreePercentage = calculatePercentage(
    analytics.employmentHistoryAnalytics.notRelatedToDegree,
    totalJobs
  );

  // Sector breakdown percentages
  Object.keys(analytics.employmentHistoryAnalytics.sectorBreakdown).forEach(sector => {
    analytics.employmentHistoryAnalytics.sectorBreakdown[`${sector}Percentage`] = calculatePercentage(
      analytics.employmentHistoryAnalytics.sectorBreakdown[sector],
      totalJobs
    );
  });

  return analytics;
};
