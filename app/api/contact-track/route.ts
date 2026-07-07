import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  const supabase = await createClient();

  let query = supabase
    .from('contact_messages')
    .select('id, name, email, phone, message, reply, status, created_at, replied_at')
    .order('created_at', { ascending: false });

  // Filter by name if provided
  if (name && name.trim()) {
    query = query.ilike('name', `%${name}%`);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, messages: data, count: data?.length });
}
