import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please enter email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

// Generating password reset token
userSchema.methods.generatePasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
