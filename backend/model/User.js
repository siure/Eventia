import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const saltRounds = 10;
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.method.comparePassword() = async function (candidatePassword) {
  return await bcrypt.candidatePassword(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
