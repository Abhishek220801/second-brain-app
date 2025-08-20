import 'dotenv/config.js';
import express from 'express';
import {z} from 'zod';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User, {connectDB} from './db.js';
 
const app = express();
const port = process.env.PORT;

app.use(express.json());

await connectDB();

app.post('/api/v1/signup', async (req, res)=> {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(user){
        res.json({message: 'User already exists!'});
        return;
    } 
    await User.create({username, password});
    res.json({
        message: 'User signed up successfully.'
    })
})
app.post('/api/v1/signin', (req, res)=> {

})
app.post('/api/v1/content', (req, res)=> {

})
app.get('/api/v1/content', (req, res)=> {

})
app.delete('/api/v1/content', (req, res)=> {

})

app.get('/api/v1/brain/:shareLink', (req,res)=>{

})

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}.`);
})