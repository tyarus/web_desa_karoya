'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadPublicImage } from '@/lib/supabase/storage';
import { formFile, formString } from '@/lib/action-utils';
import { revalidatePath } from 'next/cache';

export type UMKMInput = {
  id?: string;
  name: string;
  description: string;
  owner_name: string;
  cover_url?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
  maps_url?: string;
  email?: string;
  template_id?: string;
  accent_color?: string;
  status?: 'draft' | 'published';
};

export type UMKMProductInput = {
  id?: string;
  umkm_id: string;
  name: string;
  description: string;
  price?: string;
  image_url?: string;
};

export async function saveUMKM(input: FormData | UMKMInput) {
  console.log('=== saveUMKM called ===');
  const supabase = await createClient();
  let name = '';
  let description = '';
  let owner_name = '';
  let phone = '';
  let whatsapp = '';
  let instagram = '';
  let facebook = '';
  let address = '';
  let maps_url = '';
  let email = '';
  let coverUrl: string | undefined;
  let templateId = 'A';
  let status: 'draft' | 'published' = 'draft';
  let id: string | undefined;

  if (input instanceof FormData) {
    name = formString(input.get('name'));
    description = formString(input.get('description'));
    owner_name = formString(input.get('owner_name'));
    phone = formString(input.get('phone')) || '';
    whatsapp = formString(input.get('whatsapp')) || '';
    instagram = formString(input.get('instagram')) || '';
    facebook = formString(input.get('facebook')) || '';
    address = formString(input.get('address')) || '';
    maps_url = formString(input.get('maps_url')) || '';
    email = formString(input.get('email')) || '';
    templateId = formString(input.get('template_id')) || 'A';
    status = (formString(input.get('status')) as 'draft' | 'published') || 'draft';
    id = formString(input.get('id')) || undefined;

    console.log('FormData values:', { name, description, owner_name, templateId, status, id });

    const file = formFile(input.get('cover'));

    if (file) {
      console.log('File found, uploading...');
      const uploadedUrl = await uploadPublicImage(supabase, file, 'umkm');
      coverUrl = uploadedUrl ?? undefined;
    } else {
      coverUrl = formString(input.get('cover_url')) || undefined;
      console.log('Using cover_url:', coverUrl);
    }
  } else {
    name = input.name;
    description = input.description;
    owner_name = input.owner_name;
    phone = input.phone || '';
    whatsapp = input.whatsapp || '';
    instagram = input.instagram || '';
    facebook = input.facebook || '';
    address = input.address || '';
    maps_url = input.maps_url || '';
    email = input.email || '';
    templateId = input.template_id || 'A';
    status = input.status || 'draft';
    id = input.id;
    coverUrl = input.cover_url;
  }

  console.log('Processed values:', { name, description, owner_name, templateId, status, coverUrl });

  if (!name || !description || !owner_name) {
    console.log('Validation failed: missing required fields');
    return {
      ok: false,
      message: 'Nama, deskripsi, dan nama pemilik harus diisi',
      data: null,
    };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    const payload = {
      name,
      slug,
      description,
      owner_name,
      phone,
      whatsapp,
      instagram,
      facebook,
      address,
      maps_url,
      email,
      template_id: templateId,
      status,
      ...(coverUrl && { cover_url: coverUrl }),
    };

    if (id) {
      const { data, error } = await supabase
        .from('umkm')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/umkm');
      revalidatePath(`/umkm/${slug}`);
      return {
        ok: true,
        message: 'UMKM berhasil diperbarui',
        data,
      };
    } else {
      const { data, error } = await supabase
        .from('umkm')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/umkm');
      return {
        ok: true,
        message: 'UMKM berhasil ditambahkan',
        data,
      };
    }
  } catch (error) {
    console.error('Error in saveUMKM:', error);
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan UMKM',
      data: null,
    };
  }
}

export async function deleteUMKM(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('umkm').delete().eq('id', id);

    if (error) throw error;
    revalidatePath('/umkm');
    return {
      ok: true,
      message: 'UMKM berhasil dihapus',
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus UMKM',
    };
  }
}

export async function saveUMKMProduct(input: FormData | UMKMProductInput) {
  console.log('=== saveUMKMProduct called ===');
  const supabase = await createClient();
  let umkm_id = '';
  let name = '';
  let description = '';
  let price = '';
  let imageUrl: string | undefined;
  let id: string | undefined;

  if (input instanceof FormData) {
    umkm_id = formString(input.get('umkm_id'));
    name = formString(input.get('product_name'));
    description = formString(input.get('description'));
    price = formString(input.get('price')) || '';
    id = formString(input.get('id')) || undefined;

    console.log('Product FormData:', { umkm_id, name, description, price, id });

    const file = formFile(input.get('image'));

    if (file) {
      const uploadedUrl = await uploadPublicImage(
        supabase,
        file,
        'umkm/products'
      );
      imageUrl = uploadedUrl ?? undefined;
    } else {
      imageUrl = formString(input.get('image_url')) || undefined;
    }
  } else {
    umkm_id = input.umkm_id;
    name = input.name;
    description = input.description;
    price = input.price || '';
    id = input.id;
    imageUrl = input.image_url;
  }

  if (!umkm_id || !name || !description) {
    return {
      ok: false,
      message: 'UMKM ID, nama produk, dan deskripsi harus diisi',
      data: null,
    };
  }

  try {
    const insertData = {
      umkm_id,
      name,
      description,
      price,
      image_url: imageUrl,
    };

    if (id) {
      const { data, error } = await supabase
        .from('umkm_products')
        .update(insertData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/umkm');
      return {
        ok: true,
        message: 'Produk berhasil diperbarui',
        data,
      };
    } else {
      const { data, error } = await supabase
        .from('umkm_products')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/umkm');
      return {
        ok: true,
        message: 'Produk berhasil ditambahkan',
        data,
      };
    }
  } catch (error) {
    console.error('Error saving product:', JSON.stringify(error, null, 2));
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan produk',
      data: null,
    };
  }
}

export async function deleteUMKMProduct(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('umkm_products').delete().eq('id', id);

    if (error) throw error;
    revalidatePath('/umkm');
    return {
      ok: true,
      message: 'Produk berhasil dihapus',
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus produk',
    };
  }
}
