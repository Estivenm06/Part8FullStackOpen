import mongoose from 'mongoose'
const { Schema }= mongoose

const schema = new Schema({
    username: {
        type: String,
        required: true,
        minLenght: 3
    },
    favoriteGenre: {
        type: String,
        required: true,
    }
})

export default mongoose.model('User', schema)