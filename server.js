import express from 'express';
import connectDB from './db.js';
import apps from "./routes/app.js"

const app = express();

connectDB();

app.use(express.json());
app.use(express.static('public'));

app.use('/data', apps);

app.set('trust proxy', true);

app.get('/', (req, res) => {
    res.send('Hello from MongoDB Atlas!');
});

app.listen(3001, () => {
    console.log("Server is running on port");
});
