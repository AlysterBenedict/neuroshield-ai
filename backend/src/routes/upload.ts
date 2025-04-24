
import express from 'express';
import passport from 'passport';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import prisma from '../db';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to authenticate using JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Route for handling file upload and ML inference
router.post(
  '/',
  authenticateJWT,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  async (req: any, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.video || !files.audio) {
        return res.status(400).json({ message: 'Both video and audio files are required' });
      }

      const videoFile = files.video[0];
      const audioFile = files.audio[0];

      // Send video to ML inference service
      const videoFormData = new FormData();
      videoFormData.append('file', fs.createReadStream(videoFile.path), {
        filename: videoFile.filename,
        contentType: videoFile.mimetype,
      });

      const videoResponse = await fetch(
        `${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/infer/video`,
        {
          method: 'POST',
          body: videoFormData,
        }
      );

      if (!videoResponse.ok) {
        throw new Error(`Video inference failed: ${videoResponse.statusText}`);
      }

      const videoFeatures = await videoResponse.json();

      // Send audio to ML inference service
      const audioFormData = new FormData();
      audioFormData.append('file', fs.createReadStream(audioFile.path), {
        filename: audioFile.filename,
        contentType: audioFile.mimetype,
      });

      const audioResponse = await fetch(
        `${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/infer/audio`,
        {
          method: 'POST',
          body: audioFormData,
        }
      );

      if (!audioResponse.ok) {
        throw new Error(`Audio inference failed: ${audioResponse.statusText}`);
      }

      const audioFeatures = await audioResponse.json();

      // Send both features for fusion
      const fusionResponse = await fetch(
        `${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/infer/fusion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            v: videoFeatures.videoFeatures,
            a: audioFeatures.audioFeatures,
          }),
        }
      );

      if (!fusionResponse.ok) {
        throw new Error(`Fusion inference failed: ${fusionResponse.statusText}`);
      }

      const fusionResult = await fusionResponse.json();

      // Store results in database
      const session = await prisma.session.create({
        data: {
          userId: req.user.id,
          riskScore: fusionResult.riskScore,
          modelVersion: '1.0.0', // Default model version
          videoFeatures: videoFeatures.videoFeatures,
          audioFeatures: audioFeatures.audioFeatures,
          fusionOutput: fusionResult.fusionOutput,
        },
      });

      // Clean up uploaded files
      fs.unlinkSync(videoFile.path);
      fs.unlinkSync(audioFile.path);

      // Return results
      res.status(201).json({
        message: 'Assessment completed successfully',
        session,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

export default router;
