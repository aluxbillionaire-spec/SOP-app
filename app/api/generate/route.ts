import { NextRequest } from 'next/server';
import { openai } from '../../../lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate SOP using OpenAI GPT
    const prompt = `You are an expert process documentation writer.
Convert the following raw text or transcript into a clean, step-by-step SOP for training new hires.

Structure your response as follows:
- SOP Title
- Purpose
- Tools/Apps Used
- Step-by-Step Instructions (numbered)
- Notes & Best Practices
- Checklist for onboarding (short version)

Keep language simple, clear, and professional.

Raw text: ${text}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5-turbo', // Using gpt-5-turbo as a placeholder for GPT-5
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const generatedText = response.choices[0].message.content || '';
    
    // Parse the response into structured format
    const sections = generatedText.split('\n\n');
    const title = sections[0]?.replace('- ', '') || 'Untitled SOP';
    const purpose = sections[1]?.replace('- ', '') || '';
    const tools = sections[2]?.replace('- ', '') || '';
    
    // Parse steps (numbered list)
    const stepsSection = sections[3] || '';
    const steps = stepsSection
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    
    const notes = sections[4]?.replace('- ', '') || '';
    
    // Parse checklist
    const checklistSection = sections[5] || '';
    const checklist = checklistSection
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^-\s*/, '').trim());

    return new Response(
      JSON.stringify({
        title,
        purpose,
        tools,
        steps,
        notes,
        checklist
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}