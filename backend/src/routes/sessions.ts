
import express from 'express';
import passport from 'passport';
import prisma from '../db';

const router = express.Router();

// Middleware to authenticate using JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Get sessions for logged-in user
router.get('/', authenticateJWT, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.session.findMany({
      where: {
        userId,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });

    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Store new session
router.post('/', authenticateJWT, async (req: any, res) => {
  try {
    const { videoFeatures, audioFeatures, fusionOutput, riskScore } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!videoFeatures || !audioFeatures || !fusionOutput || riskScore === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId,
        riskScore,
        modelVersion: '1.0.0', // Default model version
        videoFeatures,
        audioFeatures,
        fusionOutput,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
