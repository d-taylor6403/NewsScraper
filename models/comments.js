var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    name: {
        type: String
    },
    body: {
        type: String,
        required: true
    }
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;