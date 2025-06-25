import Groq from 'groq-sdk';
export { renderers } from '../../renderers.mjs';

const groq = new Groq({
  apiKey: "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"
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 500
    });
    return new Response(
      JSON.stringify({
        message: completion.choices[0].message.content
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate response"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
