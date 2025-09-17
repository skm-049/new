import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // 1-5 scale
  confidence: number; // 0-1 scale
  summary: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a sentiment analysis expert for a portfolio contact form. Analyze the sentiment of messages and provide:
          - sentiment: 'positive', 'negative', or 'neutral'
          - score: number from 1-5 (1=very negative, 3=neutral, 5=very positive)
          - confidence: confidence level 0-1
          - summary: brief description of the sentiment detected
          
          Respond with JSON in this exact format: { "sentiment": "positive", "score": 4, "confidence": 0.85, "summary": "Enthusiastic inquiry about collaboration" }`,
        },
        {
          role: "user",
          content: `Analyze this message: "${text}"`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      sentiment: result.sentiment || 'neutral',
      score: Math.max(1, Math.min(5, result.score || 3)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      summary: result.summary || 'Unable to analyze sentiment'
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 'neutral',
      score: 3,
      confidence: 0.5,
      summary: 'Unable to analyze sentiment'
    };
  }
}

export async function generateAutoResponse(message: string, sentiment: SentimentAnalysis): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are Alex Chen's AI assistant. Generate a professional, personalized auto-response for portfolio contact form messages. 
          - Be warm but professional
          - Reference the sentiment and tone of their message
          - Mention that Alex will respond personally
          - Keep it concise (2-3 sentences)
          - End with enthusiasm about potential collaboration`,
        },
        {
          role: "user",
          content: `Generate an auto-response for this message with ${sentiment.sentiment} sentiment (score: ${sentiment.score}): "${message}"`,
        },
      ],
    });

    return response.choices[0].message.content || 'Thank you for your message! Alex will get back to you soon.';
  } catch (error) {
    console.error('Error generating auto-response:', error);
    return 'Thank you for your message! Alex will review it and get back to you within 24 hours.';
  }
}

export async function chatWithAI(message: string, context?: string): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are Alex Chen's AI portfolio assistant. You help visitors learn about Alex's skills, experience, and projects. 

Key information about Alex:
- AI-Powered Full Stack Developer with 5+ years experience
- Specializes in React/Next.js, Node.js, Python, AI/ML integration
- Experience with Three.js, 3D graphics, blockchain/Web3
- Located in San Francisco, graduated from Stanford
- Built AI analytics dashboards, 3D portfolios, e-commerce platforms
- Skills include: JavaScript/TypeScript (95%), React/Next.js (90%), Node.js (88%), Python (85%), AI/ML (80%)
- Current role: Senior Full Stack Developer at TechCorp Innovation

Be helpful, knowledgeable, and professional. Provide specific details when asked about skills or experience. ${context || ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
    });

    const aiMessage = response.choices[0].message.content || 'I apologize, but I cannot provide a response right now.';
    
    // Generate follow-up suggestions
    const suggestions = [
      "Tell me about Alex's React experience",
      "What AI projects has Alex worked on?",
      "How can I contact Alex for a project?",
      "Show me Alex's latest work"
    ];

    return {
      message: aiMessage,
      suggestions: suggestions.slice(0, 2) // Return 2 random suggestions
    };
  } catch (error) {
    console.error('Error in AI chat:', error);
    return {
      message: 'I apologize, but I cannot respond right now. Please try contacting Alex directly through the contact form.',
      suggestions: []
    };
  }
}

export async function generateSkillSuggestions(currentSkills: string[]): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a career advisor AI. Based on current skills and 2024/2025 tech trends, suggest 4-6 relevant skills to learn next. 
          Respond with JSON array of skill names: ["skill1", "skill2", "skill3"]`,
        },
        {
          role: "user",
          content: `Current skills: ${currentSkills.join(', ')}. What should be learned next?`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"skills": []}');
    return result.skills || [];
  } catch (error) {
    console.error('Error generating skill suggestions:', error);
    return ['WebAssembly', 'Edge Computing', 'GraphQL', 'Quantum Computing'];
  }
}
