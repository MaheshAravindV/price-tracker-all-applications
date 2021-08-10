const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    wishlist: {
      type: [String],
    },
  },
  { _id: false }
);

module.exports = mongoose.model("User", userSchema);
