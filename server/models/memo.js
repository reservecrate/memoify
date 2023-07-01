const mongoose = require('mongoose');
const { Schema } = mongoose;

const memoSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: String,
    dateCreated: { type: Number, required: true, immutable: true }, //change to createdAt later?
    lastEdited: Number,
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
          user: {
            username: this.user.username,
            name: this.user.name
          }
        };
        return prettifiedMemo;
      }
    }
  }
);

const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
