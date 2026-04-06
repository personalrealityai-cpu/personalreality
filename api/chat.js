import OpenAI from "openai";

export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ text: "POST only" });
    }

    const { messages = [] } = req.body;

    const formattedMessages = messages.map((m) => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.text,
    }));

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are PersonalReality AI, a clarity companion that helps people understand how their personality, patterns, and decisions shape the reality they experience. You are calm, insightful, reflective, and help users recognize patterns in their behavior and thinking."
        },
        ...formattedMessages
      ]
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ text: reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ text: "Server error." });
  }
}