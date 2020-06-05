const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  parent: { type: Types.ObjectId, ref: 'Data', required: true },
  value: { type: Number, required: true },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
});

module.exports = model('Item', schema);
