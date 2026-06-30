const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getSessions,
  getSessionById,
  deleteSession,
} = require('../Controllers/chatController');

const { protect, authorize } = require('../Middleware/authMiddleware');
const { validateChatMessage } = require('../Middleware/validateRequest');

// Sabhi chat routes ke liye login zaroori hai
// authorize('patient', 'doctor') — dono access kar sakte hain
router.use(protect);
router.use(authorize('patient', 'doctor'));

router.post('/send', validateChatMessage, sendMessage);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionById);
router.delete('/sessions/:id', deleteSession);

module.exports = router;
