import mongoose, {model, Schema} from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

export async function connectDB(){
    await mongoose.connect(MONGO_URI)
    .then(()=>console.log(`MongoDB connected.`))
    .catch(()=>console.error(`Error connecting to MongoDB.`));
}

const userSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

const UserModel = model('User', userSchema);

export default UserModel;
