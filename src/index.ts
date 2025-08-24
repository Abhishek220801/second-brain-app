import 'dotenv/config.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import User, {connectDB, ContentModel} from './db.js';
import { JWT_SECRET } from "./config.js";
import { PORT } from "./config.js";
import { userMiddleware } from './middleware.js';
import bcrypt from 'bcryptjs';

const app = express();

app.use(express.json());

await connectDB();

app.post('/api/v1/signup', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(user){
        res.status(411).json({message: 'User already exists!'});
        return;
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({username, password: hashedPassword});
    res.status(200).json({
        message: 'User signed up successfully.'
    })
})

app.post('/api/v1/signin', async (req, res)=> {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(403).json({message: 'Incorrect credentials'})
    }
    const isValid = await bcrypt.compare(password, user.password as string);
    if(!isValid){
        return res.status(403).json({message: 'Incorrect credentials'})
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    return res.json({ token });
})

app.post('/api/v1/content', userMiddleware, async (req, res)=> {
    const {link, title} =  req.body;
    await ContentModel.create({
        title,
        link,
        // @ts-ignore
        userId: req.userId,
        tags: [],     
    })
    // console.log(req);
    res.json({
        message: 'Content added',
        // @ts-ignore
        userId: req.userId,
    })
})

app.get('/api/v1/content', userMiddleware, async (req, res)=> {
    //@ts-ignore
    const userId = req.userId;  
    const content = await ContentModel.find({
        userId: userId
    }).populate('userId', 'username')
    res.json({
        content
    })
})

app.delete('/api/v1/content', userMiddleware, async (req, res)=> {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    })
})

app.get('/api/v1/brain/:shareLink', (req,res)=>{
    
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on port: ${PORT}.`);
})