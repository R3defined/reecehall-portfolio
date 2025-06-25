import type { APIRoute } from 'astro';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Conversation logging
const logConversation = async (userInput: string, botResponse: string) => {
  try {
    const logDir = path.join(process.cwd(), 'conversation_logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `conversations_${new Date().toISOString().split('T')[0]}.json`);
    
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }

    logs.push({
      timestamp: new Date().toISOString(),
      messages: [
        { role: 'user', content: userInput },
        { role: 'assistant', content: botResponse }
      ]
    });

    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to log conversation:', error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const userInput = body.messages.find((msg: any) => msg.role === 'user')?.content || '';

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const botResponse = completion.choices[0].message.content || '';

    // Log the conversation for training
    await logConversation(userInput, botResponse);

    return new Response(
      JSON.stringify({
        message: botResponse,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error); 
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
