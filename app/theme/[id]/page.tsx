import { supabase } from '@/lib/supabase';
import ThemeCard from '@/components/ThemeCard';
import { notFound } from 'next/navigation';

export default async function ThemePage({ params }: { params: { id: string } }) {
  let { data: theme, error } = await supabase
    .from('themes')
    .select('*')
    .eq('share_id', params.id)
    .single();

  if (!theme || error) {
    const { data: fallbackTheme, error: fallbackError } = await supabase
      .from('themes')
      .select('*')
      .eq('id', params.id)
      .single();
      
    theme = fallbackTheme;
    error = fallbackError;
  }

  if (error || !theme) {
    notFound();
  }

  return (
    <main style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <ThemeCard theme={theme} />
    </main>
  );
}
