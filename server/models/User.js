const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const petSchema = require("./Pet");

const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 12,
  },

  pets: [petSchema],

  role: {
    type: String,
    enum: ['OWNER', 'VET'],
    default: 'OWNER'
  },
})


userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
