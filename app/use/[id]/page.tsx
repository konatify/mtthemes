import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function UseThemeRedirect({ params }: { params: Promise<{ id: string }> }) {
  
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return <div>Theme ID not found in URL.</div>;
  }

  const { data, error } = await supabase
    .from('themes')
    .select('link')
    .eq('share_id', id.trim())
    .maybeSingle();

  if (error || !data) {
    return <div>Theme not found.</div>;
  }

  redirect(data.link);
}
