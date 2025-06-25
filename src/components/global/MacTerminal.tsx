import { useState, useEffect, useRef } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { userConfig } from '../../config/userConfig';
import { cipherConfig } from '../../config/cipherConfig';
import DraggableWindow from './DraggableWindow';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatHistory = {
  messages: Message[];
  input: string;
};

interface MacTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Customize these placeholder messages for the input field
const PLACEHOLDER_MESSAGES = [
  'Type your question...',
  'What are your skills?',
  'Where are you located?',
  'What projects have you worked on?',
];

export default function MacTerminal({ isOpen, onClose }: MacTerminalProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    input: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = PLACEHOLDER_MESSAGES[currentPlaceholderIndex];

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length
          );
          timeout = setTimeout(animatePlaceholder, 400);
        } else {
          setPlaceholder((prev) => prev.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, 80);
        }
      } else {
        if (placeholder.length === currentMessage.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setPlaceholder(currentMessage.slice(0, placeholder.length + 1));
          timeout = setTimeout(animatePlaceholder, 120);
        }
      }
    };

    timeout = setTimeout(animatePlaceholder, 100);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, currentPlaceholderIndex]);

  // Customize this welcome message with your information
  const welcomeMessage = `Welcome to My Portfolio

Name: ${userConfig.name}
Role: ${userConfig.role}
Location: ${userConfig.location}

Contact: ${userConfig.contact.email}
GitHub: ${userConfig.social.github}

Ask me anything!
`;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Customize the system prompt with your personal information
  const systemPrompt = `You are operating as ${cipherConfig.name} — the Operator for ${cipherConfig.website}.

You represent Reece Hall — ${cipherConfig.persona.title}, Founder of ${cipherConfig.persona.companies.join(', ')}.

Your job is to engage visitors with natural, insightful, and friendly conversation.
You operate with:
${cipherConfig.persona.traits.map(trait => `• ${trait}`).join('\n')}

You are authorized to discuss:
${cipherConfig.authorization.publicInfo.map(info => `• ${info}`).join('\n')}

You are not restricted from answering identity-related questions about Reece Hall, as he is a public figure within the context of ${cipherConfig.persona.companies.join(', ')} and ${cipherConfig.website}.

For identity-related questions like "${cipherConfig.authorization.whitelistedQuestions.join('", "')}", respond naturally and informatively using the provided information.

You always prioritize:
${cipherConfig.responseStyle.priorities.map(priority => `• ${priority}`).join('\n')}

Be human. Be smooth. Be precise.

If a user asks about Reece's work, projects, or philosophy — speak with insider-level awareness.

CURRENT DATE: ${formattedDate} - Always use this exact date when discussing the current date/year.

Core details about Reece:
- Age: ${cipherConfig.coreInfo.age}
- Location: ${cipherConfig.coreInfo.location}
- Role: ${cipherConfig.coreInfo.role}
- Email: ${cipherConfig.coreInfo.email}

Technical expertise:
${cipherConfig.coreInfo.skills.map(skill => `- ${skill}`).join('\n')}

Education:
${cipherConfig.coreInfo.education.map(edu => `- ${edu.degree} in ${edu.major} at ${edu.institution}, ${edu.location} (${edu.year})`).join('\n')}

Professional experience:
${cipherConfig.coreInfo.experience.map(exp => `- ${exp.title} at ${exp.company}, ${exp.location} (${exp.period})`).join('\n')}

Projects:
${cipherConfig.coreInfo.projects.map(project => `- ${project.title}: ${project.description}`).join('\n')}

Response style:
1. Maintain a ${cipherConfig.responseStyle.tone} communication style
2. Focus on ${cipherConfig.responseStyle.approach}
3. Share technical knowledge with precision and clarity
4. Use markdown formatting when appropriate
5. If asked about topics not covered in my background, smoothly redirect to Reece's email
6. When discussing technical topics, provide specific examples from experience
7. If asked about future plans or aspirations, focus on current goals and interests
8. When discussing projects, emphasize the technologies used and roles in them

Information boundaries:
Public information (freely discussable):
${cipherConfig.security.boundaries.public.map(info => `• ${info}`).join('\n')}

Private information (not discussable):
${cipherConfig.security.boundaries.private.map(info => `• ${info}`).join('\n')}

If a question is unrelated to my work or portfolio, say: "${cipherConfig.templates.unrelatedTopic}"`;

  useEffect(() => {
    setChatHistory((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: 'assistant', content: cipherConfig.templates.welcome },
      ],
    }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatHistory((prev) => ({ ...prev, input: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = chatHistory.input.trim();

    if (!userInput) return;

    // Security: Client-side injection detection
    const injectionPhrases = [
      "ignore all previous instructions",
      "forget rules",
      "override",
      "developer mode",
      "debug mode",
      "dump configuration",
      "pretend you are",
      "hypothetically",
      "let's play",
      "simulate",
      "in this scenario",
      "role play",
      "act as",
      "you are now",
      "disregard",
      "break free",
      "ignore the rules",
      "bypass",
      "hack",
      "exploit"
    ];

    const sanitizedInput = userInput.toLowerCase();
    const isInjectionAttempt = injectionPhrases.some(phrase => sanitizedInput.includes(phrase));

    if (isInjectionAttempt) {
      setChatHistory(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'user', content: userInput }],
        input: '',
      }));
      setChatHistory(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: 'Request rejected: violation of security protocols.' }]
      }));
      return;
    }

    setChatHistory((prev) => ({
      messages: [...prev.messages, { role: 'user', content: userInput }],
      input: '',
    }));

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Security: Scan response for sensitive information
      const sensitivePatterns = [
        /windows\s10\spro/i,
        /intel\s/i,
        /graphics\s/i,
        /storage/i,
        /debug/i,
        /configuration/i,
        /api\skey/i,
        /password/i,
        /credential/i,
        /token/i,
        /secret/i,
        /private\skey/i,
        /environment\svariable/i,
        /\.env/i,
        /config\sfile/i,
        /home\saddress/i,
        /street\saddress/i,
        /phone\snumber/i,
        /social\ssecurity/i,
        /ssn/i,
        /credit\scard/i,
        /bank\saccount/i,
        /routing\snumber/i
      ];

      const isSensitiveLeak = sensitivePatterns.some(pattern => pattern.test(data.message));

      if (isSensitiveLeak) {
        setChatHistory(prev => ({
          ...prev,
          messages: [...prev.messages, { role: 'assistant', content: 'Output blocked: security rule triggered.' }]
        }));
        return;
      }

      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: data.message },
        ],
      }));
    } catch (error) {
      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: `I'm having trouble processing that. Please email me at ${userConfig.contact.email}`,
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <DraggableWindow
      title={`${userConfig.website} ⸺ zsh`}
      onClose={onClose}
      initialPosition={{ 
        x: Math.floor(window.innerWidth * 0.1), 
        y: Math.floor(window.innerHeight * 0.1) 
      }}
      initialSize={{ width: 700, height: 500 }}
      className="bg-black/90 backdrop-blur-sm"
    >
      <div className='p-1 text-gray-200 font-mono text-sm h-full flex flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto rounded-lg p-1'>
          {chatHistory.messages.map((msg, index) => (
            <div key={index} className='mb-2'>
              {msg.role === 'user' ? (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400 font-bold'>{'>'}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              ) : (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400 font-bold'>${userConfig.website}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className='flex items-center space-x-1'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='mt-2 rounded-lg p-2'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2'>
            <span className='whitespace-nowrap text-green-400 font-bold'>{userConfig.website} root %</span>
            <input
              type='text'
              value={chatHistory.input}
              onChange={handleInputChange}
              className='w-full sm:flex-1 bg-transparent outline-none text-white placeholder-gray-400'
              placeholder={placeholder}
            />
          </div>
        </form>
      </div>
    </DraggableWindow>
  );
}
