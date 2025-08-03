import express from 'express';
import { createLink } from '../deeplink/deepLink.js';

const router = express.Router();

router.post("/createLink", createLink)

export default router;