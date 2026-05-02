'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './SortDropdown.module.css';

export type SortMode = 'latest' | 'for-you' | 'oldest';

type Props = {
  value: SortMode;
  onChange: (mode: SortMode) => void;
};

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'latest',  label: 'Latest'  },
  { value: 'for-you', label: 'For You' },
  { value: 'oldest',  label: 'Oldest'  },
];

export default function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = OPTIONS.find(o => o.value === value)!;

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {OPTIONS.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {opt.value === value && (
                <svg viewBox="0 0 24 24" fill="none" className={styles.checkIcon}>
                  <path d="M5 13L9 17L19 7" stroke="#e2b714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
