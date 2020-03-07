const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const CommentSchema = new mongoose.Schema({
  body: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }
}, { timestamps: true });

CommentSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  };
};

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
