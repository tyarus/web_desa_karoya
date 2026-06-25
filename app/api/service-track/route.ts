import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  const supabase = await createClient();

  let query = supabase
    .from('service_requests')
    .select('id, resident_name, service_type, status, created_at')
    .order('created_at', { ascending: false });

  // Filter by name if provided
  if (name && name.trim()) {
    query = query.ilike('resident_name', `%${name}%`);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, requests: data, count: data?.length });
}
