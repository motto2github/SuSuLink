import * as mongoose from 'mongoose';

let schema = mongoose.Schema({
  title: String,
  href: String,
  desc: String,
  starUser: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  createAt: {type: Date, default: Date.now()},
  updateAt: {type: Date, default: Date.now()}
});

export let Link = mongoose.model('link', schema);
