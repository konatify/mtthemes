import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function UseThemeRedirect({ params }: { params: { id: string } }) {
  const { data: theme, error } = await supabase
    .from('themes')
    .select('link')
    .eq('id', params.id)
    .single();

  if (error || !theme) {
    return (
      <div style={{ color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Theme not found</h1>
        <p>This link might be broken or the theme was deleted.</p>
      </div>
    );
  }

  redirect(theme.link);
}
