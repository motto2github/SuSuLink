import * as mongoose from 'mongoose';

let schema = mongoose.Schema({
  title: String,
  href: String,
  desc: String,
  starCount: Number,
  starUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  createAt: {type: Date, default: Date.now()},
  updateAt: {type: Date, default: Date.now()}
});

export let CommonLink = mongoose.model('common_link', schema);
