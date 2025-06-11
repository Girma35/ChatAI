import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./config/database";
import { chats, user as users } from "./db/schema"; // renamed 'user' to 'users' to avoid conflict
import { eq,desc } from "drizzle-orm";
import crypto from "crypto";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stream Chat
const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY || "nngqwr6xffyq5",
  process.env.STREAM_API_SECRET || "dcj2b2qkvq4xbygwgbtnf3f2mkgjxvp85wdn77kb5t2pbcypz9ua854vtr6cu976"
);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Middleware

app.use(cors());
app.use(express.json());

// Root route

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Register user
app.post("/register-user", async (req: Request, res: Response): Promise<any> => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  try {
    const userId = email.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    console.log(`userId: ${userId}`);

    const userResponse = await streamChat.queryUsers({ id: { $eq: userId } });

    if (userResponse.users.length > 0) {
      return res.status(400).json({ error: "User already exists." });
    }

    const newUser = {
      id: userId,
      name,
      email,
      role: "user",
    };
    await streamChat.upsertUser(newUser);

    // Check if user exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId)); // Correct field usage

    if (!existingUser.length ) {
      // Insert new user into the database
      await db.insert(users).values({
        id: userId,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`User registered: Name - ${name}, Email - ${email} ${userId}`);

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Check if user exists
app.post("/check-user", async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const userId = email.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const userResponse = await streamChat.queryUsers({ id: { $eq: userId } });
    return res.status(200).json({ exists: userResponse.users.length > 0 });
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


// Chat with Gemini AI
app.post("/chat", async (req: Request, res: Response): Promise<any> => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required." });
  }

  try {

     const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId)); 

    if (!existingUser.length ) {
      
        return res.status(404).json({ message: "User not found." });
      
    }


  
    const userResponse = await streamChat.queryUsers({ id: { $eq: userId } });

    if (userResponse.users.length === 0) {
      return res.status(404).json({ error: "User not found. please register" });
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const response = result.response;
    const aiMessage: string = response?.text() ?? "I'm sorry, I didn't understand that.";

    await db.insert(chats).values({
      id: crypto.randomUUID(),
      userId: userId,
      message: message,
      reply: aiMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    interface MyChannelData {
      name: string;
      created_by?: { id: string; name?: string };
      members?: string[];
    }

    const channelData: MyChannelData = {
      name: "Assistant Chat",
      created_by: { id: "ai-bot" },
      members: [userId, "ai-bot"],
    };

    const channel = streamChat.channel("messaging", `chat-${userId}`, channelData);

    await channel.create();
    await channel.sendMessage({ text: aiMessage, user: { id: "ai-bot", name: "AI Assistant" } });

    console.log(`Message sent to channel chat-${userId}:`, aiMessage);

    return res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error("Error handling chat message:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//get chat history

app.get("/chat-history/:userId", async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;
  console.log(`Fetching chat history for userId: ${userId}`);

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId)); 

    if (!existingUser.length) {
      return res.status(404).json({ message: "User not found." });
    }

    const chatHistory = await db
      .select({
        id: chats.id,
        message: chats.message,
        reply: chats.reply,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt));

    if (chatHistory.length === 0) {
      return res.status(404).json({ message: "No chat history found for this user." });
    }

    return res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
