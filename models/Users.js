const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
  },
});

usersSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
});

module.exports = mongoose.model("Users", usersSchema);
