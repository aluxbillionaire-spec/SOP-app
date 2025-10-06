import OpenAI from 'openai';

// This will be replaced with an environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});