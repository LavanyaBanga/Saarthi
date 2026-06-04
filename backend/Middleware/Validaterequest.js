const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a message',
    });
  }

  if (message.trim().length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Message too long (max 2000 characters)',
    });
  }

  req.body.message = message.trim();
  next();
};

module.exports = { validateChatMessage };