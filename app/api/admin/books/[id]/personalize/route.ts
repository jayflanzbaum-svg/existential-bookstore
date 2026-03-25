import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminAuth';

interface PersonalizeAnswers {
  scene: string;
  pull: string;
  moment: string;
  shift: string;
  passing: string;
}

interface Props {
  params: { id: string };
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest, { params }: Props) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { answers, existingReview, bookTitle, bookAuthor } = await req.json() as {
    answers: PersonalizeAnswers;
    existingReview: string;
    bookTitle: string;
    bookAuthor: string;
  };

  const userReflections = [
    answers.scene?.trim(),
    answers.pull?.trim(),
    answers.moment?.trim(),
    answers.shift?.trim(),
    answers.passing?.trim(),
  ].filter(Boolean);

  if (userReflections.length === 0) {
    return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
  }

  const prompt = `You are editing a book review for "${bookTitle}" by ${bookAuthor}.

EXISTING REVIEW:
${existingReview}

PERSONAL REFLECTIONS FROM THE REVIEWER (use these as much as possible):
1. Setting the Scene — ${answers.scene || '(not answered)'}
2. What Drew Me To It — ${answers.pull || '(not answered)'}
3. The Moment That Stayed — ${answers.moment || '(not answered)'}
4. The Shift — ${answers.shift || '(not answered)'}
5. Who I'd Pass It To — ${answers.passing || '(not answered)'}

RULES:
- Weave the personal reflections into the existing review to create one cohesive piece
- Preserve the reviewer's exact words and phrasing as much as possible — only correct clear typos or grammatical errors, do not rephrase for style
- The reviewer's voice must dominate — their sentences, their rhythm, their specificity
- Do not add generic filler, transitions, or AI-sounding language
- Write in first person where the personal reflections are incorporated
- Keep the factual content and critical observations from the existing review
- The result should feel personal, lived-in, and authentic — not polished or generic
- Paragraphs should be separated by a blank line
- Return ONLY the final review text — no preamble, no title, no explanation`;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const newReview = (message.content[0] as { type: string; text: string }).text.trim();

  const { error } = await supabaseAdmin
    .from('books')
    .update({ review: newReview, personalized: true })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ review: newReview });
}
