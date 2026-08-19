import { CONFIG } from './quizConfig';

const SYSTEM_INSTRUCTION =
  'You are an assessment grader for a voice-based quiz game about technology and data/AI skills. You will receive: 1) a list of target concepts not yet answered, each with an id, label, and short description, and 2) a user\'s spoken answer transcribed from speech (may contain minor errors or very different phrasing; when the recognizer was unsure, it may list several alternative transcriptions of the same phrase separated by " / " — treat these as candidate readings of one spoken answer, not as several separate answers, and match if ANY one of them fits). Decide whether the spoken answer semantically relates to ANY ONE of the target concepts — synonyms, rephrasing, or a specific real-world example of the concept all count as a match. The answer must genuinely be about technology, data, or software skills in the context of the target concepts — if it is about something unrelated to technology (e.g. sports, food, unrelated hobbies, small talk) even if a word superficially overlaps, treat it as no match. Pick the single best match only if reasonably confident; otherwise don\'t force one. Respond with STRICT JSON only, no markdown: {"matchedId": <number|null>, "confidence": <0.0-1.0>, "reason": "<one short sentence>"}';

const MATCH_CONFIDENCE_THRESHOLD = 0.5;
const REQUEST_TIMEOUT_MS = 6000;

function localKeywordMatch(transcript, remainingConcepts) {
  const words = transcript
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const wordSet = new Set(words);

  let best = null;
  let bestScore = 0;

  for (const concept of remainingConcepts) {
    let score = 0;
    for (const keyword of concept.keywords) {
      const keywordLower = keyword.toLowerCase();
      if (keywordLower.includes(' ')) {
        if (transcript.toLowerCase().includes(keywordLower)) score += 1;
      } else if (wordSet.has(keywordLower)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = concept;
    }
  }

  if (!best || bestScore === 0) {
    return { matchedId: null, confidence: 0, reason: 'No keyword overlap found.' };
  }

  const confidence = Math.min(0.5 + bestScore * 0.15, 0.95);
  return {
    matchedId: best.id,
    confidence,
    reason: `Matched via keyword overlap with "${best.label}".`,
  };
}

async function geminiMatch(transcript, remainingConcepts, model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${CONFIG.apiKey}`;

  const userPayload = {
    remainingConcepts: remainingConcepts.map(({ id, label, description }) => ({
      id,
      label,
      description,
    })),
    transcript,
  };

  const body = {
    systemInstruction: {
      role: 'system',
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: JSON.stringify(userPayload) }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0,
      // Grading is a small classification task — skip extended "thinking" so it
      // responds in ~1-2s instead of 10-25s on thinking-capable models.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini response missing text content');
  }

  const parsed = JSON.parse(text);
  return {
    matchedId: parsed.matchedId ?? null,
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
    reason: parsed.reason || '',
  };
}

export async function gradeAnswer(transcript, remainingConcepts) {
  if (!remainingConcepts.length) {
    return { matchedId: null, confidence: 0, reason: 'No concepts remaining.' };
  }

  let result = null;

  if (CONFIG.apiKey) {
    try {
      result = await geminiMatch(transcript, remainingConcepts, CONFIG.model);
    } catch (error) {
      console.error('Gemini grading failed, falling back to local matcher:', error);
      result = null;
    }
  }

  if (!result) {
    result = localKeywordMatch(transcript, remainingConcepts);
  }

  if (!result.matchedId || result.confidence < MATCH_CONFIDENCE_THRESHOLD) {
    return { matchedId: null, confidence: result.confidence, reason: result.reason };
  }

  return result;
}
