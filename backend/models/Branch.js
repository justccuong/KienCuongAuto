const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  id: String,
  name: String,
  location: String,
  hotline: String,
  image: String,
  description: String,
  mapsUrl: String,
  mapsEmbed: String,
  socials: {
    facebook: String,
    tiktok: String,
    zalo: String,
  },
});

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;