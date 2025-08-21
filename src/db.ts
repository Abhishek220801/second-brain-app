import mongoose, {model, Schema} from 'mongoose';

export async function connectDB(){
    await mongoose.connect('mongodb://localhost:27017/brainly')
    .then(()=>console.log(`MongoDB connected.`))
    .catch(()=>console.error(`Error connecting to MongoDB.`));
}

const userSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

const UserModel = model('User', userSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model('Content', ContentSchema);
export default UserModel;
