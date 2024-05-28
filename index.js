// const express = require('express');
import express from 'express';
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const dotenv = require('dotenv');
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


// Counter schema and model
const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// Middleware to parse JSON
app.use(express.json());

app.get('/',(req, res)=>{
    res.send('server is running successfully...............')
})

// Get counter value
app.get('/counter', async (req, res) => {
    const counter = await Counter.findOne();
    res.json({ count: counter ? counter.count : 0 });
});

// Increment counter value
app.post('/counter/increment', async (req, res) => {
    const counter = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
    res.json({ count: counter.count });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
