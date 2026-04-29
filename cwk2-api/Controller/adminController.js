const fs = require('fs');
const path = require('path');
const Account = require('../Models/accountModel');
const Profile = require('../Models/profileModel');

/**
 * POST /admin/seed
 * Seed database with alumni data from JSON file
 * Warning: This will create accounts and profiles - use with caution
 */
exports.seedDatabase = async (req, res) => {
  try {
    console.log('[ADMIN] Starting database seed...');

    // Read seed data
    const seedFilePath = path.join(__dirname, '../scripts/seed-alumni-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

    let accountsCreated = 0;
    let profilesCreated = 0;
    let errors = [];

    // Process each entry
    for (const entry of seedData) {
      try {
        const { account: accountData, profile: profileData } = entry;

        // Check if account already exists
        const existingAccount = await Account.findOne({ email: accountData.email });
        if (existingAccount) {
          errors.push(`Account with email ${accountData.email} already exists`);
          continue;
        }

        // Create account
        const account = await Account.create({
          email: accountData.email,
          password: accountData.password,
          fullname: accountData.fullname,
          isAlumni: accountData.isAlumni,
          createdAt: new Date(accountData.createdAt),
        });

        accountsCreated++;
        console.log(`[ADMIN] Created account: ${accountData.email}`);

        // Create profile if alumni
        if (accountData.isAlumni && profileData) {
          try {
            // Deep clone and clean all _id fields from nested arrays
            const cleanProfileData = JSON.parse(JSON.stringify(profileData));
            
            const arraysToClean = ['degrees', 'certifications', 'licenses', 'courses', 'employmentHistory'];
            
            arraysToClean.forEach(arrayName => {
              if (Array.isArray(cleanProfileData[arrayName])) {
                cleanProfileData[arrayName] = cleanProfileData[arrayName].map(item => {
                  const { _id, ...cleanItem } = item;
                  return cleanItem;
                });
              }
            });

            console.log(`[ADMIN] Creating profile for ${accountData.fullname}`);
            const profile = await Profile.create({
              ...cleanProfileData,
              account: account._id,
            });

            profilesCreated++;
            console.log(`[ADMIN] Successfully created profile for: ${accountData.fullname}`);
          } catch (profileErr) {
            errors.push(`Profile creation failed for ${accountData.fullname}: ${profileErr.message}`);
            console.error(`[ADMIN] Profile error for ${accountData.fullname}:`, profileErr);
          }
        }
      } catch (err) {
        errors.push(`Error processing ${entry.account.email}: ${err.message}`);
        console.error(`[ADMIN] Error: ${err.message}`);
      }
    }

    // Return summary
    const summary = {
      success: true,
      message: 'Database seeding completed',
      stats: {
        accountsCreated,
        profilesCreated,
        totalProcessed: seedData.length,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : null,
    };

    console.log('[ADMIN] Seeding complete:', summary.stats);
    res.json(summary);

  } catch (error) {
    console.error('[ADMIN] Seeding failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database seeding failed',
      error: error.message,
    });
  }
};

/**
 * GET /admin/seed-status
 * Get current database statistics
 */
exports.getSeedStatus = async (req, res) => {
  try {
    const accountCount = await Account.countDocuments();
    const profileCount = await Profile.countDocuments();
    const alumniCount = await Account.countDocuments({ isAlumni: true });

    res.json({
      success: true,
      stats: {
        totalAccounts: accountCount,
        totalProfiles: profileCount,
        alumniAccounts: alumniCount,
        nonAlumniAccounts: accountCount - alumniCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seed status',
      error: error.message,
    });
  }
};

/**
 * DELETE /admin/clear-database
 * Warning: Clears all accounts and profiles - DESTRUCTIVE
 */
exports.clearDatabase = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const accountsDeleted = await Account.deleteMany({});
    const profilesDeleted = await Profile.deleteMany({});

    console.log('[ADMIN] Database cleared');

    res.json({
      success: true,
      message: 'Database cleared successfully',
      stats: {
        accountsDeleted: accountsDeleted.deletedCount,
        profilesDeleted: profilesDeleted.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear database',
      error: error.message,
    });
  }
};
