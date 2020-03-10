const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug'); // auto create URL slugs
const User = mongoose.model('User');

const InterviewSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  description: String,
  body: String,
  favoritesCount: { type: Number, default: 0 },
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

InterviewSchema.plugin(uniqueValidator, { message: 'is already taken' });

InterviewSchema.methods.slugify = function () {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

InterviewSchema.methods.updateFavoriteCount = function () {
  const interview = this;

  return User.count({ favorites: { $in: [interview._id] } }).then(function (count) {
    interview.favoritesCount = count;

    return interview.save();
  });
}


InterviewSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

InterviewSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favoritesCount: this.favoritesCount,
    favorited: user ? user.isFavorite(this._id) : false,
    author: this.author,
    comments: this.comments
  };
};

mongoose.model('Interview', InterviewSchema)
