import * as mongoose from 'mongoose';

let schema = mongoose.Schema({
  name: {type: String, unique: true},
  password: String,
  createAt: {type: Date, default: Date.now()},
  updateAt: {type: Date, default: Date.now()}
});

export let User = mongoose.model('user', schema);
