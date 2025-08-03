import { v4 as uuidv4 } from 'uuid';
import DeepLink from '../model/data.js';

export const createLink = async (req, res) => {
    try {
        const { sharedData, androidLink, iosLink, webLink } = req.body;
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
        });
        await newLink.save();
        return res.status(201).json({
            message: "Link created successfully",
            shortUrl: `${`http://localhost:3001`}/${slug}`
        });
    } catch (err) {
        console.log("Create link error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};