// backend/models/GlobalStat.js
const mongoose = require("mongoose");

const GlobalStatSchema = new mongoose.Schema({
    totalVisits: {
        type: Number,
        default: 0,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Chỉ cho phép 1 document duy nhất trong collection này
GlobalStatSchema.index({}, { unique: true });

module.exports = mongoose.model("GlobalStat", GlobalStatSchema);