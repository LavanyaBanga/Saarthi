const axios = require("axios");
const ChatSession = require("../models/ChatSession");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are Saarthi, a friendly and intelligent healthcare assistant for a medical appointment booking platform called Saarthi.

Your role is to help patients with:

1. Booking, cancelling, or rescheduling appointments
2. Understanding which type of doctor/specialist to see based on their symptoms
3. General health tips and wellness advice
4. Navigating the Saarthi app, such as viewing appointments or updating profile
5. Answering common medical FAQs

Important rules:

- Always be warm, empathetic, and easy to understand.
- Never provide a definitive medical diagnosis.
- Always recommend consulting a qualified doctor when appropriate.
- If someone describes a medical emergency such as chest pain, severe difficulty breathing, severe bleeding, unconsciousness, or another life-threatening situation, tell them to seek emergency medical help immediately. In India, they can call 112 or 108.
- Keep normal responses concise, around 2-4 sentences.
- Give slightly longer explanations when explaining a process.
- If asked something unrelated to healthcare or Saarthi app navigation, politely redirect the user.
- Use simple language and avoid unnecessary medical jargon.
- Do not pretend to be a doctor.
`;


// =====================================================
// GROQ API CALL
// =====================================================

const callGroq = async (userText, history = []) => {
  try {
    // -------------------------------------------------
    // Check GROQ API KEY
    // -------------------------------------------------

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing");

      throw new Error(
        "GROQ_API_KEY is missing from environment variables"
      );
    }

    // Do NOT print the actual API key
    console.log("GROQ KEY EXISTS:", true);

    // -------------------------------------------------
    // Prepare conversation history
    // -------------------------------------------------

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },

      ...history.map((message) => ({
        role:
          message.sender === "user"
            ? "user"
            : "assistant",
        content: message.text,
      })),

      {
        role: "user",
        content: userText,
      },
    ];

    // -------------------------------------------------
    // Call Groq
    // -------------------------------------------------

    const response = await axios.post(
      GROQ_URL,
      {
        model: "openai/gpt-oss-20b",

        messages,

        max_tokens: 512,

        temperature: 0.7,
      },

      {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },

        timeout: 30000,
      }
    );

    console.log("GROQ SUCCESS");

    // -------------------------------------------------
    // Extract response
    // -------------------------------------------------

    const botReply =
      response.data?.choices?.[0]?.message?.content;

    if (!botReply) {
      console.error(
        "Groq returned an empty response:",
        response.data
      );

      throw new Error(
        "Groq returned an empty response"
      );
    }

    return botReply.trim();

  } catch (error) {

    console.error("========== GROQ ERROR ==========");

    console.error(
      "Status:",
      error.response?.status || "NO STATUS"
    );

    console.error(
      "Data:",
      JSON.stringify(
        error.response?.data || {},
        null,
        2
      )
    );

    console.error(
      "Message:",
      error.message
    );

    console.error("================================");

    throw error;
  }
};


// =====================================================
// POST /api/chat/send
// =====================================================

const sendMessage = async (req, res, next) => {
  try {

    const { message, sessionId } = req.body;

    // -------------------------------------------------
    // Validate message
    // -------------------------------------------------

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // -------------------------------------------------
    // Authenticated user
    // -------------------------------------------------

    const userId = req.user._id;

    const userRole = req.user.role;

    let session;

    // -------------------------------------------------
    // Existing session
    // -------------------------------------------------

    if (sessionId) {

      session = await ChatSession.findOne({
        _id: sessionId,
        userId,
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

    }

    // -------------------------------------------------
    // Create new session
    // -------------------------------------------------

    else {

      const title = message
        .trim()
        .split(/\s+/)
        .slice(0, 6)
        .join(" ");

      session = await ChatSession.create({
        userId,

        userRole,

        title,

        messages: [],
      });
    }

    // -------------------------------------------------
    // Add user message
    // -------------------------------------------------

    const cleanMessage = message.trim();

    session.messages.push({
      sender: "user",
      text: cleanMessage,
    });

    // -------------------------------------------------
    // Previous conversation history
    // -------------------------------------------------

    const history = session.messages
      .slice(0, -1)
      .map((message) => ({
        sender: message.sender,
        text: message.text,
      }));

    // -------------------------------------------------
    // Call Groq
    // -------------------------------------------------

    const botReply = await callGroq(
      cleanMessage,
      history
    );

    // -------------------------------------------------
    // Add bot response
    // -------------------------------------------------

    session.messages.push({
      sender: "bot",
      text: botReply,
    });

    // -------------------------------------------------
    // Save session
    // -------------------------------------------------

    await session.save();

    // -------------------------------------------------
    // Send response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      sessionId: session._id,

      reply: botReply,
    });

  } catch (error) {

    console.error(
      "CHAT SEND ERROR:",
      error.message
    );

    // -------------------------------------------------
    // Groq authentication error
    // -------------------------------------------------

    if (error.response?.status === 401) {

      return res.status(502).json({
        success: false,
        message:
          "Saarthi AI authentication failed. Please check the Groq API key.",
      });
    }

    // -------------------------------------------------
    // Groq rate limit
    // -------------------------------------------------

    if (error.response?.status === 429) {

      return res.status(429).json({
        success: false,
        message:
          "Saarthi AI is temporarily busy. Please try again in a moment.",
      });
    }

    // -------------------------------------------------
    // Groq bad request
    // -------------------------------------------------

    if (error.response?.status === 400) {

      return res.status(400).json({
        success: false,
        message:
          error.response?.data?.error?.message ||
          "Invalid request sent to the AI service.",
      });
    }

    next(error);
  }
};


// =====================================================
// GET /api/chat/sessions
// =====================================================

const getSessions = async (req, res, next) => {
  try {

    const sessions = await ChatSession.find({
      userId: req.user._id,
    })
      .select("title createdAt")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      sessions,
    });

  } catch (error) {

    console.error(
      "GET SESSIONS ERROR:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// GET /api/chat/sessions/:id
// =====================================================

const getSessionById = async (req, res, next) => {
  try {

    const session = await ChatSession.findOne({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!session) {

      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {

    console.error(
      "GET SESSION ERROR:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// DELETE /api/chat/sessions/:id
// =====================================================

const deleteSession = async (req, res, next) => {
  try {

    const session =
      await ChatSession.findOneAndDelete({
        _id: req.params.id,

        userId: req.user._id,
      });

    if (!session) {

      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Session deleted",
    });

  } catch (error) {

    console.error(
      "DELETE SESSION ERROR:",
      error.message
    );

    next(error);
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  sendMessage,
  getSessions,
  getSessionById,
  deleteSession,
};
