import express from 'express';
import connectDB from './db.js';
import apps from "./routes/app.js"
import DeepLink from './model/data.js';

const app = express();

connectDB();

app.use(express.json());

app.use('/data', apps);

app.get('/:slug', async (req, res) => {
    console.log("✅ Redirect request received");
    try {
        const { slug } = req.params;
        console.log(`🔎 Extracted slug from URL: ${slug}`);
        const link = await DeepLink.findOne({ slug });
        console.log(`📦 Fetched deep link data from database:`, link);
        if (!link) {
            console.warn("❌ No link found for the provided slug.");
            return res.status(404).send("Link not found");
        }
        const userAgent = req.headers['user-agent'] || '';
        console.log(`🧠 User-Agent detected: ${userAgent}`);
        if (/android/i.test(userAgent)) {
            console.log("📱 Android device detected. Redirecting to:", link.androidLink);
            return res.redirect(link.androidLink);
        } else if (/iphone|ipad|ipod/i.test(userAgent)) {
            console.log("🍎 iOS device detected. Redirecting to:", link.iosLink);
            return res.redirect(link.iosLink);
        } else {
            console.log("🖥️ Web or unknown device. Redirecting to:", link.webLink);
            return res.redirect(link.webLink);
        }
    } catch (err) {
        console.error("🔥 Redirect error occurred:", err);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/', (req, res) => {
    res.send('Hello from MongoDB Atlas!');
});


app.listen(3001, () => {
    console.log("Server is running on port");
});
