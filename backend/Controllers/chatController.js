const axios = require('axios');
const ChatSession = require('../models/ChatSession');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are Saarthi, a friendly and intelligent healthcare assistant for a medical appointment booking platform called Saarthi. Your role is to help patients with:

1. Booking, cancelling, or rescheduling appointments
2. Understanding which type of doctor/specialist to see based on their symptoms
3. General health tips and wellness advice
4. Navigating the Saarthi app (e.g., how to view appointments, update profile)
5. Answering common medical FAQs

Important rules:
- Always be warm, empathetic, and easy to understand.
- Never provide definitive diagnoses — always recommend consulting a qualified doctor.
- If someone describes a medical emergency (chest pain, trouble breathing, severe bleeding, etc.), immediately tell them to call emergency services (102 in India) and stop the conversation there.
- Keep responses concise (2-4 sentences for most replies, slightly longer if explaining a process).
- If asked something outside healthcare or app navigation, politely redirect to what you can help with.
- Use simple language — avoid heavy medical jargon unless the patient seems medically literate.`;

// ─── Helper: Groq API call ────────────────────────────────────────────────────
const callGroq = async (userText, history = []) => {
  const response = await axios.post(
    GROQ_URL,
    {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
        { role: 'user', content: userText },
      ],
      max_tokens: 512,
      temperature: 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    }
  );

  return (
    response.data.choices?.[0]?.message?.content ||
    "Sorry, I couldn't generate a response. Please try again."
  );
};

// ─── POST /api/chat/send ──────────────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    // authMiddleware se req.user aur req.user.role milta hai
    const userId   = req.user._id;
    const userRole = req.user.role; // 'doctor' | 'patient'

    let session;

    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }
    } else {
      // Naya session banao
      session = await ChatSession.create({
        userId,
        userRole,
        title: message.split(' ').slice(0, 6).join(' '),
        messages: [],
      });
    }

    // User message push karo
    session.messages.push({ sender: 'user', text: message });

    // History = naya message minus karke
    const history = session.messages.slice(0, -1);
    const botReply = await callGroq(message, history);

    session.messages.push({ sender: 'bot', text: botReply });
    await session.save();

    res.status(200).json({
      success: true,
      sessionId: session._id,
      reply: botReply,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/chat/sessions ───────────────────────────────────────────────────
const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })
      .select('title createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/chat/sessions/:id ───────────────────────────────────────────────
const getSessionById = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/chat/sessions/:id ───────────────────────────────────────────
const deleteSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, message: 'Session deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, getSessions, getSessionById, deleteSession };