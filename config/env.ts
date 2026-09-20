import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'STANDARD_USERNAME',
  'LOCKED_USERNAME',
  'PASSWORD',
] as const;

type EnvKey = (typeof requiredVariables)[number];

const missing = requiredVariables.filter((name) => !process.env[name]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = Object.fromEntries(
  requiredVariables.map((name) => [name, process.env[name] as string]),
) as Record<EnvKey, string>;