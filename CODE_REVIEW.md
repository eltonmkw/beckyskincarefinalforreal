# Code Review Summary

## Overview
Quick security- and reliability-focused review of the Expo skin-analysis app with Supabase + Google AI integrations.

## Key Findings
1. **API key exposure risk mitigated:** Debug logging in `src/services/api.js` was printing partial Google AI keys and environment-variable names. This has been reduced to a simple presence check to avoid leaking secrets to client logs or crash reporting systems.
2. **Supabase defaults hide configuration errors:** `src/lib/supabase.ts` falls back to placeholder URL/keys. In a misconfigured build, requests would silently target a fake host instead of failing fast, making authentication/routing issues hard to diagnose. Consider throwing when required env vars are missing.
3. **Local storage is primary persistence path:** `src/utils/storage.js` saves analysis and routines to AsyncStorage before attempting Supabase sync. Users who never authenticate will accumulate sensitive scans on-device without encryption or expiry; add a retention policy and clear-data UX to reduce risk.
4. **LLM prompt surface is large:** `src/services/api.js` embeds extensive prompts and error messages. Centralizing model names, timeout, and max tokens would reduce drift between skin and product analyzers and simplify future model updates.

## Recommendations
- Add a configuration guard in `src/lib/supabase.ts` that throws when `EXPO_PUBLIC_SUPABASE_URL` or `EXPO_PUBLIC_SUPABASE_ANON_KEY` are absent instead of silently using placeholders.
- Introduce a minimal telemetry-safe logging helper (e.g., `logConfigStatus`) to standardize non-sensitive diagnostics for API clients.
- Provide a user-facing control to clear cached skin analyses/routines and consider trimming saved scans after a sensible retention period.
- Extract shared Gemini settings (model names, timeouts) into a single module to ensure consistent behavior across `analyzeSkin` and `analyzeProducts`.
