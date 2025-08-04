import express from 'express';
import { createLink, getSharedLinkData } from '../deeplink/deepLink.js';

const router = express.Router();

router.post("/createLink", createLink)
router.get("/:slug", getSharedLinkData)

export default router;