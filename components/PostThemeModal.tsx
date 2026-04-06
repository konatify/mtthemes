'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './PostThemeModal.module.css';

type Props = {
  onClose: () => void;
  onPosted: () => void;
};

export default function PostThemeModal({ onClose, onPosted }: Props) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [desc, setDesc] = useState('');
  const [nameError, setNameError] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [posting, setPosting] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  async function handlePost() {
    let valid = true;
    if (name.trim().length === 0) { setNameError(true); valid = false; } else setNameError(false);
    if (link.trim().length === 0) { setLinkError(true); valid = false; } else setLinkError(false);
    if (!valid) return;

    setPosting(true);
    const { error } = await supabase.from('themes').insert({
      name: name.trim(),
      link: link.trim(),
      description: desc.trim() || null,
    });
    setPosting(false);
    if (!error) {
      onPosted();
      onClose();
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.field}>
          <label className={styles.label}>Name of theme</label>
          <input
            className={`${styles.input} ${nameError ? styles.inputError : ''}`}
            value={name}
            onChange={e => { setName(e.target.value); if (e.target.value.trim()) setNameError(false); }}
            placeholder="e.g. Mocha Latte"
            maxLength={80}
          />
          {nameError && <span className={styles.error}>Must be at least 1 character.</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Link to theme
            <span
              className={styles.infoWrap}
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
            >
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" className={styles.infoIcon}>
                <path fill="#ffffff" fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"/>
              </svg>
              {tooltip && (
                <span className={styles.tooltip}>
                  To get the link, go to the settings in Monkeytype and scroll down to the themes section, press on &lsquo;share&rsquo;, and click &lsquo;copy to clipboard&rsquo;.
                </span>
              )}
            </span>
          </label>
          <input
            className={`${styles.input} ${linkError ? styles.inputError : ''}`}
            value={link}
            onChange={e => { setLink(e.target.value); if (e.target.value.trim()) setLinkError(false); }}
            placeholder="https://monkeytype.com/..."
          />
          {linkError && <span className={styles.error}>Must be at least 1 character.</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Description for theme
            <span className={styles.charCount}>{desc.length}/280</span>
          </label>
          <textarea
            className={styles.textarea}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe your theme..."
            maxLength={280}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
          <button className={styles.post} onClick={handlePost} disabled={posting}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
