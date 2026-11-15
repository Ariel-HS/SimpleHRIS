try {
  process.loadEnvFile();
} catch {
  // no .env file, use defaults
}