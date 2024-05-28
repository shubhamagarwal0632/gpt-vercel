import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.set('strictQuery', false); // Avoids deprecation warnings
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

// Route to render hello view
app.get('/', (req, res) => {
    res.send('hello');
});
app.get('/hello',(req,res)=>{
    res.render('hello')
})

// Get counter value
app.get('/counter', async (req, res) => {
    try {
        const counter = await Counter.findOne();
        res.json({ count: counter ? counter.count : 0 });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Increment counter value
app.post('/counter/increment', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
        res.json({ count: counter.count });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
