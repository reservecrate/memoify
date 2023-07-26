import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IUser from '../interfaces/user.ts';

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: String,
    passwordHash: {
      type: String,
      required: true
    },
    memos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Memo'
      }
    ]
  },
  {
    methods: {
      prettify() {
        const prettifiedUser = {
          id: this._id.toString(),
          username: this.username,
          name: this.name,
          memos: this.memos.map(memo => memo.toString())
        };
        return prettifiedUser;
      }
    }
  }
);

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

export default User;
