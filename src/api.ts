// Lightweight clients for the two no-backend services this site uses:
//   - Web3Forms  → emails the contact form straight to my inbox
//   - Supabase   → stores the arcade leaderboard (shared across all visitors)
//
// Every key referenced here is PUBLIC by design — the Web3Forms access key and
// the Supabase anon key are meant to ship in client code. Write access is fenced
// by Web3Forms' own rules and Supabase Row Level Security, not by hiding the key.

// Accept either the plain project URL (https://xxx.supabase.co) or the full
// REST endpoint (…/rest/v1/) — normalize to the base so we can append paths.
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  ?.replace(/\/+$/, '')
  .replace(/\/rest\/v1$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const contactConfigured = Boolean(WEB3FORMS_KEY);

export interface ScoreEntry {
  name: string;
  score: number;
}

const sbHeaders = () => ({
  apikey: SUPABASE_ANON_KEY!,
  Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
});

// Top N scores, highest first.
export async function fetchTopScores(limit = 3): Promise<ScoreEntry[]> {
  if (!supabaseConfigured) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/leaderboard?select=name,score&order=score.desc,created_at.asc&limit=${limit}`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to load scores (${res.status})`);
  return res.json();
}

// Record a new score.
export async function submitScore(entry: ScoreEntry): Promise<void> {
  if (!supabaseConfigured) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
    method: 'POST',
    headers: {
      ...sbHeaders(),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Failed to save score (${res.status})`);
}

// Send a contact message to my inbox via Web3Forms.
export async function sendMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!contactConfigured) throw new Error('Contact form is not configured yet.');
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `Portfolio message from ${data.name}`,
      from_name: data.name,
      name: data.name,
      email: data.email,
      message: data.message,
    }),
  });
  const json = await res.json().catch(() => ({ success: false }));
  if (!json.success) throw new Error(json.message || 'Message failed to send.');
}
