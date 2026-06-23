import { Router, Request, Response, NextFunction } from 'express';
import { analyzeProfile, compareProfiles } from '../services/analysisService.js';
import { fetchUser } from '../services/githubService.js';
import { searchRateLimit } from '../middleware/rateLimit.js';

const router = Router();

// Analyze a single GitHub profile
router.get(
  '/analyze/:username',
  searchRateLimit,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.params;

      if (!username || !/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
        res.status(400).json({
          error: 'Invalid username format',
          code: 'INVALID_USERNAME',
        });
        return;
      }

      const analysis = await analyzeProfile(username);
      res.json({ success: true, data: analysis });
    } catch (err) {
      next(err);
    }
  }
);

// Compare two GitHub profiles
router.get(
  '/compare/:username1/:username2',
  searchRateLimit,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username1, username2 } = req.params;
      const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

      if (!usernameRegex.test(username1) || !usernameRegex.test(username2)) {
        res.status(400).json({ error: 'Invalid username format', code: 'INVALID_USERNAME' });
        return;
      }

      if (username1.toLowerCase() === username2.toLowerCase()) {
        res.status(400).json({ error: 'Cannot compare a user to themselves', code: 'SAME_USER' });
        return;
      }

      const result = await compareProfiles(username1, username2);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// Quick user lookup (for autocomplete / preview)
router.get(
  '/user/:username',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await fetchUser(req.params.username);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
