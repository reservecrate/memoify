import { Schema, model, Document } from 'mongoose';
import IMemo from '../interfaces/memo.ts';
import { PopulatedMemoDoc } from '../interfaces/memo.ts';

const memoSchema = new Schema<IMemo>(
  {
    title: {
      type: String,
      required: true
    },
    content: String,
    dateCreated: { type: Number, required: true, immutable: true }, //change to createdAt later?
    // lastEdited: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    methods: {
      async prettify() {
        const populatedMemo: PopulatedMemoDoc = await this.populate('author', {
          username: 1,
          name: 1
        });
        const prettifiedMemo = {
          id: populatedMemo._id.toString(),
          title: populatedMemo.title,
          content: populatedMemo.content,
          dateCreated: populatedMemo.dateCreated,
          author: {
            username: populatedMemo.author.username,
            name: populatedMemo.author.name,
            id: populatedMemo.author._id.toString()
          }
        };
        return prettifiedMemo;
      }
    }
  }
);

const Memo = model('Memo', memoSchema);

export default Memo;
