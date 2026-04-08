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
        <h1 className={styles.logo}>Monkeytype Themes</h1>
        <p className={styles.disclaimer}>Not endorsed or promoted by miodec.</p>
      </div>

      {/* Theme grid */}
{loading ? (
  <div className={styles.loading}>
    <svg
      className={styles.spinner}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <g fill="#000000" fillRule="evenodd" clipRule="evenodd">
        <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"/>
        <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"/>
      </g>
    </svg>
    <span>Loading...</span>
    <svg
      className={styles.keyIcon}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`.cls-1{fill:none;stroke:#e2b712;stroke-miterlimit:10;stroke-width:1.95px;}`}</style>
      </defs>
      <rect className="cls-1" x="7.54" y="5.07" width="13.81" height="8.98" transform="translate(10.99 -7.41) rotate(45)"/>
      <path className="cls-1" d="M16.15,17.62,14.6,19.17a2,2,0,0,1-2.76,0l-2-2L5,21.89a2.08,2.08,0,0,1-1.47.61h0A2.07,2.07,0,0,1,1.5,20.43h0A2.08,2.08,0,0,1,2.11,19L6.87,14.2l-2-2a2,2,0,0,1,0-2.76L6.38,7.85Z"/>
      <line className="cls-1" x1="15.66" y1="4.43" x2="11.27" y2="8.83"/>
    </svg>
  </div>
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
