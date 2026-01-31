'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { fetchSelections } from '@/lib/api/client';
import type { Selection } from '@/lib/api/types';

const PLAYLIST_IMAGES = [
  '/img/playlist01.png',
  '/img/playlist02.png',
  '/img/playlist03.png',
] as const;

export default function Sidebar() {
  const [selections, setSelections] = useState<Selection[]>([]);

  useEffect(() => {
    fetchSelections()
      .then(setSelections)
      .catch(() => setSelections([]));
  }, []);

  const items: { _id: number; name?: string }[] =
    selections.length > 0
      ? (() => {
          const withTracks = selections
            .filter((s) => Array.isArray(s.items) && s.items.length > 0)
            .sort((a, b) => a._id - b._id);
          const rest = selections.filter(
            (s) => !Array.isArray(s.items) || s.items.length === 0,
          );
          return [...withTracks, ...rest].slice(0, 3);
        })()
      : [
          { _id: 2, name: 'Плейлист дня' },
          { _id: 3, name: 'Танцевальные хиты' },
          { _id: 4, name: 'Инди-заряд' },
        ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.personal}>
        <p className={styles.personalName}>Sergey.Ivanov</p>
        <Link href="/auth/signin" className={styles.icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </Link>
      </div>
      <div className={styles.block}>
        <div className={styles.list}>
          {items.map((selection, index) => (
            <div key={selection._id} className={styles.item}>
              <Link
                className={styles.link}
                href={`/selection/${selection._id}`}
                prefetch={false}
              >
                <Image
                  src={PLAYLIST_IMAGES[index % PLAYLIST_IMAGES.length]}
                  alt={selection.name || "day's playlist"}
                  width={250}
                  height={170}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
