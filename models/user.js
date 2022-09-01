require("dotenv").config();
import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { isEmail } from "validator";

import { makeJwtToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    name: {
      first: {
        type: String,
      },
      last: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

UserSchema.methods = {
  validPassword: async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);

    if (isMatch) {
      const token = makeJwtToken(this);

      return { token };
    } else {
      return false;
    }
  },
};

const User = model("user", UserSchema);

export default User;
