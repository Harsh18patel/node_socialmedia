import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator, { stripLow } from "validator";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "please enter your firstname"],
    },
    lastName: {
      type: String,
      require: [true, "please enter your lastname"],
    },
    username: {
      type: String,
      require: [true, "please enter your lastname"],
    },
    profilePicture: {
      type: String, 
    },
    email: {
      type: String,
      require: [true, "please enter your email"],
      trim: true,
      lowercase: true,
      validator: {
        validate: (value) => validator.isEmail(value),
        message: "Email is not perfect",
      },
    },
    phoneNumber: {
      type: String,
      require: [true, "please enter your phoneNumber"],
      trim: true,
      validator: {
        validate: (value) => validator.isMobilePhone(value),
        message: "phoneNumber is not perfect",
      },
    },
    password: {
      type: String,
      expose: false,
      require: [true, "please enter your password"],
      validator: {
        validate: (value) => validator.isStrongPassword(value),
        message: "password is not validate",
      },
    },
    DOB: {
      type: String,
      validator: {
        validate: (value) => {
          let isMatch = validator.isDate(value);
          let currDate = Date.now();
          let newDate = new Date(value); // convert isMatch date into array
          let gap = Math.abs(currDate - newDate);
          let age = gap / (1000 * 60 * 60 * 24 * 365.25);

          return isMatch && age > 18;
        },
        message: "DOB is not valid",
      },
    },
    // coordinates: {
    //     type: {
    //       type: ["Point"],
    //       required: true,
    //     },
    //     coordinates: {
    //       type: [Number],
    //       required: true,
    //     },
    //   },
    address: {
      line1: String,
      city: String,
      state: String,
      country: String,
      pincode: Number,
    },
    followers: {
      type: Number,
      default: 0,
      min: 0
    },
    following: {
      type: Number,
      default: 0,
      min: 0
    },
    postCount: Number,
    post:String,
    caption: String,
    profilePic: String,
    OTP: String,
    isPrivate: {
      type: Boolean,
      default: false,
    },
    profileImage: String,
  },
  { timeStamps: true }
);

userSchema.index({ coordinates: "2dsphere" });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
  },
});
export const User = mongoose.model("user", userSchema);
