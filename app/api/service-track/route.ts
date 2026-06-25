import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return Response.json({ ok: false, message: 'Nama diperlukan' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('service_requests')
    .select('id, resident_name, service_type, status, created_at')
    .ilike('resident_name', `%${name}%`)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, requests: data });
}
