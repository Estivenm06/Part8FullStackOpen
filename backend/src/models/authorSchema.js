import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    unique: true,
  },
  born: {
    type: Number,
  },
});

schema.plugin(uniqueValidator);

export default mongoose.model("Author", schema);
