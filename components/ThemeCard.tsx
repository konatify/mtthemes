'use client';

import { useState, useEffect } from 'react';
import { supabase, Theme } from '@/lib/supabase';
import { getFingerprint } from '@/lib/fingerprint';
import { recordView } from '@/lib/history';
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

function handleShare() {
  const shareLink = `${window.location.origin}/use/${theme.share_id}`;
  navigator.clipboard.writeText(shareLink);
  alert('Link copied! This will redirect users to the theme.');
}

  function handleUse() {
    recordView(theme.id);
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
          onClick={handleUse}
        >
          Use theme
        </a>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          <button
            className={styles.likeBtn}
            onClick={handleShare}
            aria-label="Share Theme"
            title="Copy theme link"
          >
            <svg 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={styles.heartSvg}
            >
              <g strokeWidth="0"></g>
              <g strokeLinecap="round" strokeLinejoin="round"></g>
              <g> 
                <path d="M7.05025 1.53553C8.03344 0.552348 9.36692 0 10.7574 0C13.6528 0 16 2.34721 16 5.24264C16 6.63308 15.4477 7.96656 14.4645 8.94975L12.4142 11L11 9.58579L13.0503 7.53553C13.6584 6.92742 14 6.10264 14 5.24264C14 3.45178 12.5482 2 10.7574 2C9.89736 2 9.07258 2.34163 8.46447 2.94975L6.41421 5L5 3.58579L7.05025 1.53553Z" fill="#ffffff"></path> 
                <path d="M7.53553 13.0503L9.58579 11L11 12.4142L8.94975 14.4645C7.96656 15.4477 6.63308 16 5.24264 16C2.34721 16 0 13.6528 0 10.7574C0 9.36693 0.552347 8.03344 1.53553 7.05025L3.58579 5L5 6.41421L2.94975 8.46447C2.34163 9.07258 2 9.89736 2 10.7574C2 12.5482 3.45178 14 5.24264 14C6.10264 14 6.92742 13.6584 7.53553 13.0503Z" fill="#ffffff"></path> 
                <path d="M5.70711 11.7071L11.7071 5.70711L10.2929 4.29289L4.29289 10.2929L5.70711 11.7071Z" fill="#ffffff"></path> 
              </g>
            </svg>
          </button>

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
    </div>
  );
}
