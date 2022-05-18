const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notesSchema = new mongoose.Schema({
  notes: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("Notes", notesSchema);
