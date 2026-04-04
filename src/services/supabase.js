import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = url && key ? createClient(url, key) : null;

export async function getProjects() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('project').select('*');
  if (error) {
    console.error('Erro ao buscar projetos:', error.message);
    return [];
  }
  return data;
}
export async function getWorkers() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('workers').select('*');
  if (error) {
    console.error('Erro ao buscar projetos:', error.message);
    return [];
  }
  return data;
}
