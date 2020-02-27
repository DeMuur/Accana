const mongoose = require("mongoose");

const twitterFeedSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    twitterUsernameAddedToFeed: String,
    twitterUsername_idAddedToFeed: String,
});

module.exports = mongoose.model("twitterFeedDatabeses", twitterFeedSchema);