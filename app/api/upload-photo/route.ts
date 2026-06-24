import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseStorageBucket } from '@/lib/supabase/config';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const prefix = formData.get('prefix') as string || 'photo';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = await createClient();

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const path = `government/${prefix}-${timestamp}.${extension}`;

    const { error } = await supabase.storage
      .from(supabaseStorageBucket)
      .upload(path, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage
      .from(supabaseStorageBucket)
      .getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
