import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API endpoint for Google Search Grounding for SK-NIC & Slovak regulatory updates
app.post('/api/sk-nic-search', async (req, res) => {
  try {
    const { query, language = 'sk' } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set on the server.');
      return res.status(503).json({
        error: 'GEMINI_API_KEY is missing. Search grounding requires a configured Gemini API key.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the official RMD26 Slovak GovTech Copilot and SK-NIC Grant Intelligence Engine.
Your task is to fetch and synthesize real-time, factual information about SK-NIC (Slovak domain registry & Fond SK-NIC grant calls), MIRRI SR technology funding, Slovak VAT / IČ DPH requirements, and EU AI Act compliance in Slovakia.
Always use the Google Search tool to retrieve the latest real-time grant calls, exact deadlines, allocated budgets, eligibility criteria, and recent regulatory updates.
Provide structured responses with clear markdown headings, bullet points, verified call numbers (e.g. Call codes, deadlines, budget sums in EUR), and cite the source URLs provided by Google Search.
Respond in ${language === 'en' ? 'English' : 'Slovak'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction
      }
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract sources from grounding chunks
    const sources: { title: string; url: string }[] = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks as any[]) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Official SK-NIC / Slovak Gov Source',
            url: chunk.web.uri
          });
        }
      }
    }

    // Extract grounding supports with highlighted segment ranges
    const groundingSupports: {
      groundingChunkIndices: number[];
      segment?: { startIndex?: number; endIndex?: number; text?: string };
      confidenceScores?: number[];
    }[] = [];

    if (groundingMetadata?.groundingSupports) {
      for (const support of groundingMetadata.groundingSupports as any[]) {
        groundingSupports.push({
          groundingChunkIndices: support.groundingChunkIndices || [],
          segment: support.segment || {},
          confidenceScores: support.confidenceScores || []
        });
      }
    }

    const searchQueries: string[] = (groundingMetadata?.webSearchQueries as string[]) || [];

    res.json({
      text: response.text || 'No content returned from Google Search grounding.',
      sources,
      groundingSupports,
      searchQueries,
      isGrounded: true,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error executing grounded search via Gemini API:', error);
    res.status(500).json({
      error: error.message || 'Error executing Google Search grounding.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RMD26 Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
