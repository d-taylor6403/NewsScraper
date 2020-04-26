var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;