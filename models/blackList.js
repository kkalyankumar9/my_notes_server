  const mongoose = require("mongoose");
  const blackListSchema = mongoose.Schema({
    blacklist: { type: [String] },
  });

  const BlackListModule = new mongoose.model("blacklist", blackListSchema);
  module.exports = { BlackListModule };
