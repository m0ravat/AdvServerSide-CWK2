const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const AccountSchema = new mongoose.Schema(
  {
    // Authentication & Basic Info
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
            /^[a-zA-Z0-9._%+-]+@westminster\.ac\.uk$/, // Domain validation
            'Please use your @westminster.ac.uk email'
      ]    
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 10,
      select: false, // Don't return password by default
      match: [
            /^(?=.*[A-Z])(?=.*\d).+$/, // Strong password regex
            'Password must contain at least one uppercase letter and one number'
        ]
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"]
    },
    isAlumni: {
      type: Boolean,
      default: false,
      required: true
    },
 
    // Reference to Profile if database to be adapated as a pure NoSQL Database
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      default: null,
    },
  }
);
 
// Hash password before saving
AccountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
 
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
 
// Method to compare passwords
AccountSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

 
module.exports = mongoose.model('Account', AccountSchema);
