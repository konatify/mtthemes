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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className={styles.main}>
      <div className={styles.topCenter}>
        <h1 className={styles.logo}>Monkeytype Themes</h1>
        <p className={styles.disclaimer}>Not endorsed or promoted by miodec.</p>

        {!loading && (
          <div className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search for a theme..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className={styles.uploadBtn}
              onClick={() => setShowModal(true)}
              title="Post theme"
            >
              <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.99997 5.50005H20M7.5 14L12.5 9.00003L17.5 14" stroke="#e2b714" strokeWidth="1.2" />
                <path d="M12.5 9.00003V20" stroke="#e2b714" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        )}
      </div>

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
      ) : filteredThemes.length === 0 ? (
        <div className={styles.empty}>
          {searchQuery ? `no themes found for "${searchQuery}"` : 'no themes yet. be the first to post one!'}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredThemes.map(theme => (
            <ThemeCard key={theme.share_id} theme={theme} />
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
