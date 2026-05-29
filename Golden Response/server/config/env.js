/**
 * Environment variable validation and configuration.
 * Fails fast on startup if any required variables are missing.
 */

const requiredVars = [
  { key: 'MONGODB_URI', description: 'MongoDB connection string' },
  { key: 'JWT_SECRET', description: 'JWT signing secret (min 32 chars recommended)' },
  { key: 'GEMINI_API_KEY', description: 'Google Gemini API key from aistudio.google.com' },
];

const optionalVarsWithDefaults = {
  PORT: '5000',
  NODE_ENV: 'development',
  JWT_EXPIRE: '7d',
  GEMINI_MODEL: 'gemini-2.0-flash',
  OPENAI_MODEL: 'gpt-3.5-turbo',
  CLIENT_URL: 'http://localhost:5173',
  MAX_FILE_SIZE: '5242880',
  RATE_LIMIT_WINDOW_MS: '3600000',
  RATE_LIMIT_MAX_ANALYSIS: '10',
  RATE_LIMIT_MAX_CHAT: '30',
};

function validateEnv() {
  const missing = [];

  for (const { key, description } of requiredVars) {
    if (!process.env[key] || process.env[key].trim() === '') {
      missing.push(`  - ${key}: ${description}`);
    }
  }

  if (missing.length > 0) {
    console.error('\n=== FATAL: Missing required environment variables ===\n');
    console.error(missing.join('\n'));
    console.error('\nCopy .env.example to .env and fill in the values.\n');
    process.exit(1);
  }

  // Apply defaults for optional variables
  for (const [key, defaultValue] of Object.entries(optionalVarsWithDefaults)) {
    if (!process.env[key] || process.env[key].trim() === '') {
      process.env[key] = defaultValue;
    }
  }
}

const env = {
  get port() { return parseInt(process.env.PORT, 10) || 5000; },
  get nodeEnv() { return process.env.NODE_ENV || 'development'; },
  get isDev() { return this.nodeEnv === 'development'; },
  get isProd() { return this.nodeEnv === 'production'; },
  get mongoUri() { return process.env.MONGODB_URI; },
  get jwtSecret() { return process.env.JWT_SECRET; },
  get jwtExpire() { return process.env.JWT_EXPIRE || '7d'; },
  get geminiApiKey() { return process.env.GEMINI_API_KEY; },
  get geminiModel() { return process.env.GEMINI_MODEL || 'gemini-2.0-flash'; },
  get openaiModel() { return process.env.OPENAI_MODEL || 'gpt-3.5-turbo'; },
  get clientUrl() { return process.env.CLIENT_URL || 'http://localhost:5173'; },
  get maxFileSize() { return parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880; },
  get rateLimitWindowMs() { return parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 3600000; },
  get rateLimitMaxAnalysis() { return parseInt(process.env.RATE_LIMIT_MAX_ANALYSIS, 10) || 10; },
  get rateLimitMaxChat() { return parseInt(process.env.RATE_LIMIT_MAX_CHAT, 10) || 30; },
};

export { validateEnv };
export default env;
