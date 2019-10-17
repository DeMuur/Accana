const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    username_id: String,
    messageContent: String,
});

module.exports = mongoose.model("Test", testSchema);