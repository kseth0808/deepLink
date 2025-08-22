import { v4 as uuidv4 } from 'uuid';
import DeepLink from '../model/data.js';

export const createLink = async (req, res) => {
    try {
        const { sharedData, androidLink, iosLink, webLink, createdBy } = req.body;
        if (!sharedData || !androidLink || !iosLink || !webLink) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const slug = uuidv4();
        const newLink = new DeepLink({
            slug,
            sharedData,
            androidLink,
            iosLink,
            webLink,
            createdBy
        });
        await newLink.save();
        return res.status(201).json({
            message: "Link created successfully",
            shortUrl: `https://deeplink-dj4i.onrender.com/data/${slug}`
        });
    } catch (err) {
        console.log("Create link error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getSharedLinkData = async (req, res) => {
    try {
        const { slug } = req.params;
        const link = await DeepLink.findOne({ slug });
        if (!link) {
            return res.status(404).send("Link not found");
        }
        const userAgent = req.headers['user-agent'] || '';
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const platform = isAndroid ? "Android" : isIOS ? "iOS" : "Web";
        const ip = req.ip;
        link.clicks.push({ ip, platform });
        await link.save();
        return res.redirect(link.webLink);
    } catch (err) {
        console.error("🔥 Redirect error occurred:", err);
        res.status(500).send("Internal Server Error");
    }
};
