const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Person reference is required'],
      unique: true,
    },
    created: { type: Date, default: Date.now },
    employed: { type: Boolean },
    timeToFindJob: { type: Number },
    location: {
      type: String,
      enum: ['London', 'England', 'UK', 'Scotland', 'Ireland', 'Asia', 'Africa', 'South America', 'North America', 'Europe', 'Other'],
    },
    biography: {
      type: String,
      maxlength: 1000,
    },
    profileImage: {
      filename: String,
      path: String,
      uploadedAt: Date,
    },
    linkedinUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v);
        },
        message: 'Please provide a valid LinkedIn URL',
      },
    },
    degrees: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        institutionName: {
          type: String,
          required: [true, 'Institution name is required'],
        },
        degreeType: {
          type: String,
          enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate', 'Other'],
          required: [true, 'Degree type is required'],
        },
        fieldOfStudy: {
          type: String,
          required: [true, 'Field of study is required'],
        },
        universityDegreePage: {
          type: String,
          validate: {
            validator: function (v) {
              return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL',
          },
        },
        completionDate: {
          type: Date,
          required: [true, 'Completion date is required'],
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    certifications: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        certificationName: {
          type: String,
          required: [true, 'Certification name is required'],
        },
        issuingOrganization: {
          type: String,
          required: [true, 'Issuing organization is required'],
        },
        coursePage: {
          type: String,
          validate: {
            validator: function (v) {
              return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL',
          },
        },
        completionDate: {
          type: Date,
          required: [true, 'Completion date is required'],
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        typeOfCert: {
          type: String,
          enum: ['Cloud', 'DevOps', 'Software Development', 'Data Science', 'Project Management', 'Testing', 'Other'],
        },
        relatedToDegree: { type: Boolean },
      },
    ],
    licenses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        licenseName: {
          type: String,
          required: [true, 'License name is required'],
        },
        licenseNumber: {
          type: String,
          required: [true, 'License number is required'],
        },
        issuingBody: {
          type: String,
          required: [true, 'Issuing body is required'],
        },
        licenseBodyUrl: {
          type: String,
          validate: {
            validator: function (v) {
              return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL',
          },
        },
        issueDate: {
          type: Date,
          required: [true, 'Issue date is required'],
        },
        expiryDate: Date,
        addedAt: {
          type: Date,
          default: Date.now,
        },
        relatedToDegree: { type: Boolean },
      },
    ],
    courses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        courseName: {
          type: String,
          required: [true, 'Course name is required'],
        },
        provider: {
          type: String,
          required: [true, 'Course provider is required'],
        },
        coursePage: {
          type: String,
          validate: {
            validator: function (v) {
              return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL',
          },
        },
        completionDate: {
          type: Date,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        relatedToDegree: { type: Boolean },
      },
    ],
    employmentHistory: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        jobTitle: {
          type: String,
          required: [true, 'Job title is required'],
        },
        companyName: {
          type: String,
          required: [true, 'Company name is required'],
        },
        description: {
          type: String,
          maxlength: 500,
        },
        startDate: {
          type: Date,
          required: [true, 'Start date is required'],
        },
        endDate: Date,
        currentlyEmployed: {
          type: Boolean,
          default: false,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        relatedToDegree: { type: Boolean },
        sector: {
          type: String,
          enum: [
            'Technology & IT',
            'Financial Services',
            'Consulting',
            'Healthcare',
            'Education',
            'Manufacturing',
            'Retail & E-commerce',
            'Media & Entertainment',
            'Other',
          ],
        },
      },
    ],
    completionStatus: {
      biography: {
        type: Boolean,
        default: false,
      },
      profileImage: {
        type: Boolean,
        default: false,
      },
      linkedIn: {
        type: Boolean,
        default: false,
      },
      degrees: {
        type: Boolean,
        default: false,
      },
      certifications: {
        type: Boolean,
        default: false,
      },
      licenses: {
        type: Boolean,
        default: false,
      },
      courses: {
        type: Boolean,
        default: false,
      },
      employmentHistory: {
        type: Boolean,
        default: false,
      },
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
