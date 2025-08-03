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
        if (!link) {
            return res.status(404).send("Link not found");
        }
        const userAgent = req.headers['user-agent'] || '';
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const platform = isAndroid ? "Android" : isIOS ? "iOS" : "Web";
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        link.clicks.push({ ip, platform });
        await link.save();
        if (isAndroid) {
            console.log("📱 Android device detected. Attempting app launch...");
            return res.send(`
                <html>
                <body>
                    <script>
                        window.location.href = '${link.androidLink}';
                        setTimeout(() => { window.location.href = '${link.webLink}'; }, 2000);
                    </script>
                </body>
                </html>
            `);
        }

        if (isIOS) {
            return res.send(`
                <html>
                <body>
                    <script>
                        window.location.href = '${link.iosLink}';
                        setTimeout(() => { window.location.href = '${link.webLink}'; }, 2000);
                    </script>
                </body>
                </html>
            `);
        }
        return res.redirect(link.webLink);
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
