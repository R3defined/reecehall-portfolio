import type { APIRoute } from 'astro';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.GROQ_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return new Response(
      JSON.stringify({
        message: completion.choices[0].message.content,
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
