import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function UseThemeRedirect({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('themes')
    .select('link')
    .eq('share_id', params.id)
    .maybeSingle();

  if (error) {
    return <div>Database Error.</div>;
  }

  if (!data) {
    return <div>Theme not found. Check your share_id.</div>;
  }

  redirect(data.link);
}
