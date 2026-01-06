import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// async function createStudentInSupabase(user) {
//   const { data, error } = await supabase
//     .from('students')
//     .insert([
//       {
//         firebase_uid: user.uid,
//         name: user.displayName || 'Student',
//         email: user.email
//       }
//     ]);
//   if (error) console.error('Supabase insert error', error);
//   else console.log('Supabase student created', data);
// }