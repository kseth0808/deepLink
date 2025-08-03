import mongoose from "mongoose";

const deepLinkSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    sharedData: {
        type: String,
        required: true,
    },
    androidLink: {
        type: String,
        required: true,
    },
    iosLink: {
        type: String,
        required: true,
    },
    webLink: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        default: "anonymous",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    clicks: [
        {
            timestamp: { type: Date, default: Date.now },
            ip: String,
            platform: String,
        }
    ]
}, { timestamps: true });

const DeepLink = mongoose.model("DeepLink", deepLinkSchema);

export default DeepLink;
