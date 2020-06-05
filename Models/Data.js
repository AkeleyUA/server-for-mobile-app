const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  personalNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  address: { type: Object, required: true },
  phone: { type: String },
  items: [{ type: Types.ObjectId, ref: 'Item' }],
  parent: [{ type: Types.ObjectId, ref: 'User' }],
});

module.exports = model('Data', schema);
