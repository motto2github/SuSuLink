import * as mongoose from 'mongoose';

let schema = mongoose.Schema({
  name: {type: String, unique: true},
  password: String,
  links: [{
    title: String,
    href: String,
    desc: String,
    starCount: {type: Number, default: -1},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
  }],
  createAt: {type: Date, default: Date.now},
  updateAt: {type: Date, default: Date.now}
});

export let User = mongoose.model('user', schema);
