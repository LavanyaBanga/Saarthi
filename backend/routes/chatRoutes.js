const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getSessions,
  getSessionById,
  deleteSession,
} = require('../Controllers/chatController');

const { protect, authorize } = require('../Middleware/authMiddleware');

router.use(protect);
router.use(authorize('patient', 'doctor'));

router.post('/send', sendMessage);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionById);
router.delete('/sessions/:id', deleteSession);

module.exports = router;
