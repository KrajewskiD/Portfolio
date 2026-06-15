function getEnvironmentVariable(name: string): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  supabaseUrl: getEnvironmentVariable("VITE_SUPABASE_URL"),
  supabasePublishableKey: getEnvironmentVariable(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  ),
};
