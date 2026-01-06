import { supabase } from '../services/supabase';
import { Book } from '../types';

export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from('books').select('*');
  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }
  return data as Book[];
}
