import * as mongoose from 'mongoose';

let schema = mongoose.Schema({
  title: String,
  href: String,
  summary: String,
  starUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  sortNumber: Number,
  createAt: {type: Date, default: Date.now()},
  updateAt: {type: Date, default: Date.now()}
});

export let CommonLink = mongoose.model('common_link', schema);
