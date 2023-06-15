const mongoose = require('mongoose');
const { Schema } = mongoose;

const memoSchema = new Schema(
  {
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
  },
  {
    methods: {
      prettify() {
        const prettifiedMemo = {
          id: this._id.toString(),
          title: this.title,
          content: this.content,
          dateCreated: this.dateCreated,
          user: this.user.toString()
        };
        return prettifiedMemo;
      }
    }
  }
);

const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
