import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function UseThemeRedirect({ params }: { params: { id: string } }) {
  const targetId = params.id;
  
console.log("DEBUG: Current Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

const { data, error } = await supabase
  .from('themes')
  .select('link')
  .eq('share_id', params.id)
  .maybeSingle();

  if (error) {
    console.error("SERVER DEBUG - Supabase Error:", error);
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    console.log("SERVER DEBUG - Data returned NULL");
    return <div>Theme not found.</div>;
  }

  redirect(data.link);
}
