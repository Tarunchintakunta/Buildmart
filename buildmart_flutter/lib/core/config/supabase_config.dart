// ─────────────────────────────────────────────────────────────────────────────
// Supabase Configuration
//
// To connect to a real Supabase project:
//   1. Go to https://supabase.com → your project → Settings → API
//   2. Copy the "Project URL" and "anon public" key
//   3. Replace the placeholder values below
//   4. Enable Phone Auth in Supabase → Authentication → Providers → Phone
//   5. Set up your SMS provider (Twilio / MessageBird)
//
// ⚠️  Do NOT commit real credentials — add this file to .gitignore if using
//     real keys, or use --dart-define for CI/CD injection.
// ─────────────────────────────────────────────────────────────────────────────

class SupabaseConfig {
  // Replace with your actual Supabase project URL
  static const String url =
      String.fromEnvironment('SUPABASE_URL', defaultValue: 'https://your-project.supabase.co');

  // Replace with your Supabase anon/public key
  static const String anonKey =
      String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: 'your-anon-key-here');

  /// Returns true when real Supabase credentials have been configured.
  /// Falls back to mock/seed data when false.
  static bool get isConfigured =>
      url != 'https://your-project.supabase.co' && anonKey != 'your-anon-key-here';
}
