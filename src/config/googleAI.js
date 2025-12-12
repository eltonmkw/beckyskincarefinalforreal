export const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GOOGLE_AI_SKIN_MODEL = 'gemini-2.5-flash';
export const GOOGLE_AI_PRODUCT_MODEL = 'gemini-2.5-flash';
export const GOOGLE_AI_TIMEOUT_MS = 45000;
export const GOOGLE_AI_MAX_OUTPUT_TOKENS = 8000;

export function logGoogleApiStatus(hasKey) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log('🔑 Google AI key configured:', hasKey ? 'YES' : 'NO');
}
