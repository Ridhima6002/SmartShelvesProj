import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export async function createStudentInSupabase(user: {
  id: string;
}) {
  const { error } = await supabase
    .from('students')
    .upsert([{ firebase_uid: user.id }], { onConflict: 'firebase_uid' });

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }
}