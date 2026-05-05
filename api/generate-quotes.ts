import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, activity, place } = req.body;

  if (!name || !activity || !place) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    const styles = [
      'a minimalist beatnik writing on a napkin',
      'a cyberpunk hacker hiding in a neon alley',
      'a noir detective narrating a rainy night',
      'a zen monk observing a mountain peak',
      'a gritty industrial mechanic in a steam-filled room',
      'a surrealist painter describing a melting clock',
      'a brutalist architect analyzing a concrete slab',
      'a frantic wartime telegraph operator',
      'a cynical street poet watching a sunset',
      'a nostalgic analog radio host through heavy static',
      'a desert nomad reading constellations',
      'a clockmaker in a city of gears',
      'a deep-sea diver narrating the abyss'
    ];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const seed = Math.random().toString(36).substring(2) + Date.now();

    const prompt = `Write a completely unique 10-to-1 countdown for ${name}.
PRIMARY THEME: ${activity} in ${place}
STYLE: ${style}
SEED: ${seed}

Requirements:
- CRITICAL: Each quote must be under 100 characters
- Start from 10, count DOWN to 1
- Each number gets exactly ONE quote
- Mix of: funny, deep, short, motivational
- NO explanations, NO metadata, just raw quotes
- Make it feel like ${style}
- Reference ${activity} and ${place} naturally across quotes
- Each quote should build emotional momentum toward "1"

Format as JSON array with structure: [{"number": 10, "text": "...", "type": "funny", "imageKeyword": "..."}, ...]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1 }
    });

    const text = response.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse API response');
    }

    const quotes = JSON.parse(jsonMatch[0]);
    return res.status(200).json(quotes);
  } catch (error) {
    console.error('Error generating quotes:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate quotes',
      message: 'Using fallback quotes'
    });
  }
}
