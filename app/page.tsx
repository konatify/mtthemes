'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, Theme } from '@/lib/supabase';
import PostThemeModal from '@/components/PostThemeModal';
import ThemeCard from '@/components/ThemeCard';
import styles from './page.module.css';

export default function Home() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: false });
    setThemes((data as Theme[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchThemes(); }, [fetchThemes]);

  return (
    <main className={styles.main}>

      {/* Top-left: Post theme button */}
      <div className={styles.topLeft}>
        <button className={styles.postBtn} onClick={() => setShowModal(true)}>
          Post theme
        </button>
      </div>

      {/* Top-center: Branding */}
      <div className={styles.topCenter}>
        <h1 className={styles.logo}>mtthemes</h1>
        <p className={styles.disclaimer}>Not endorsed or promoted by miodec.</p>
      </div>

      {/* Theme grid */}
      {loading ? (
        <div className={styles.loading}>loading themes...</div>
      ) : themes.length === 0 ? (
        <div className={styles.empty}>no themes yet. be the first to post one!</div>
      ) : (
        <div className={styles.grid}>
          {themes.map(theme => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      )}

      {showModal && (
        <PostThemeModal
          onClose={() => setShowModal(false)}
          onPosted={fetchThemes}
        />
      )}
    </main>
  );
}
