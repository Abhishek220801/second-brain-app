import 'dotenv/config.js';
import express from 'express';
import {z} from 'zod';
import jwt from 'jsonwebtoken';
import User, {connectDB, ContentModel} from './db.js';
import { JWT_SECRET } from "./config.js";
import { PORT } from "./config.js";
import { userMiddleware } from './middleware.js';
 
const app = express();

app.use(express.json());

await connectDB();

app.post('/api/v1/signup', async (req, res)=> {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(user){
        res.status(411).json({message: 'User already exists!'});
        return;
    } 
    await User.create({username, password});
    res.status(200).json({
        message: 'User signed up successfully.'
    })
})

app.post('/api/v1/signin', async (req, res)=> {
const {username, password} = req.body;
    const user = await User.findOne({username, password});
    if(user){
        const token = jwt.sign({
            id: user._id,
        }, JWT_SECRET);
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: 'Incorrect credentials',
        })
    }
})
app.post('/api/v1/content', userMiddleware, async (req, res)=> {
    const {link, type} =  req.body;
    await ContentModel.create({
        link,
        type,
        // @ts-ignore
        userId: req.userId,
        tags: [],
    })
    return res.json({
        message: 'Content added'
    })
})

app.get('/api/v1/content', async (req, res)=> {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId
    })
    res.json({
        content
    })
})
app.delete('/api/v1/content', async (req, res)=> {
})

app.get('/api/v1/brain/:shareLink', (req,res)=>{

})

app.listen(PORT, ()=>{
    console.log(`Server is listening on port: ${PORT}.`);
})