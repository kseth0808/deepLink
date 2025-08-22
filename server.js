import express from 'express';
import connectDB from './db.js';
import apps from "./routes/app.js"
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

connectDB();

app.use(express.json());
app.use(express.static('public'));

app.use('/data', apps);

app.set('trust proxy', true);

app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known'), {
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
    }
}));


app.get('/', (req, res) => {
    res.send('Hello from MongoDB Atlas!');
});

app.listen(3001, () => {
    console.log("Server is running on port");
});
