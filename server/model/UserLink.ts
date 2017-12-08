import * as mongoose from 'mongoose';

let schema = mongoose.Schema({
  title: String,
  href: String,
  summary: String,
  iconUrl: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  createAt: {type: Date, default: () => Date.now()},
  updateAt: {type: Date, default: () => Date.now()}
});

export let UserLink = mongoose.model('user_link', schema);
