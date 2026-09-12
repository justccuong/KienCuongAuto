// backend/models/Visit.js
const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        index: true // Index for faster queries
    },
    ip: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
    referrer: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Index for date queries
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Compound index for efficient analytics queries
VisitSchema.index({ page: 1, timestamp: -1 });
VisitSchema.index({ createdAt: -1 });

// TTL Index: Tự động dọn sạch log truy cập cũ hơn 1 năm (365 ngày) để chống tràn database
VisitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

module.exports = mongoose.model("Visit", VisitSchema);