import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    unique: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  published: {
    type: Number,
  },
  genres: [
    {
      type: String,
    },
  ],
});

schema.plugin(uniqueValidator);

export default mongoose.model("Book", schema);
