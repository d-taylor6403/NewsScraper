var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        required: false,
        unique: true
    },
    byline: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    articleBody: {
        type: Schema.Types.ObjectId
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;