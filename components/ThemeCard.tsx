'use client';

import { useState, useEffect } from 'react';
import { supabase, Theme } from '@/lib/supabase';
import { getFingerprint } from '@/lib/fingerprint';
import styles from './ThemeCard.module.css';

type Props = {
  theme: Theme;
};

export default function ThemeCard({ theme }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(theme.likes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fp = getFingerprint();
    supabase
      .from('likes')
      .select('id')
      .eq('theme_id', theme.id)
      .eq('fingerprint', fp)
      .maybeSingle()
      .then(({ data }) => { if (data) setLiked(true); });

    supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('theme_id', theme.id)
      .then(({ count }) => { if (count !== null) setLikeCount(count); });
  }, [theme.id]);

  async function toggleLike() {
    if (loading) return;
    setLoading(true);
    const fp = getFingerprint();
    if (liked) {
      await supabase.from('likes').delete().eq('theme_id', theme.id).eq('fingerprint', fp);
      setLiked(false);
      setLikeCount(c => c - 1);
    } else {
      await supabase.from('likes').insert({ theme_id: theme.id, fingerprint: fp });
      setLiked(true);
      setLikeCount(c => c + 1);
    }
    setLoading(false);
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{theme.name}</h2>
      {theme.description && (
        <p className={styles.desc}>{theme.description}</p>
      )}
      <div className={styles.footer}>
        <a
          href={theme.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.useBtn}
        >
          Use theme
        </a>
        <button
          className={`${styles.likeBtn} ${liked ? styles.liked : ''}`}
          onClick={toggleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.heartSvg}>
            <path
              d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={liked ? '#ffffff' : 'none'}
            />
          </svg>
          <span className={styles.likeCount}>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}
