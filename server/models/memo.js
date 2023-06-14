const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
  dateCreated: { type: Number, required: true }, //Number for now, to simplify things
  lastEdited: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

memoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
