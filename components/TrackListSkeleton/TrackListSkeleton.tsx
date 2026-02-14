'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './TrackListSkeleton.module.css';

const SKELETON_ROWS = 8;

export default function TrackListSkeleton() {
  return (
    <SkeletonTheme baseColor="#313131" highlightColor="#404040">
      <div className={styles.content}>
        <div className={styles.title}>
          <div className={styles.col01}>Трек</div>
          <div className={styles.col02}>Исполнитель</div>
          <div className={styles.col03}>Альбом</div>
          <div className={styles.col04} />
        </div>
        <div className={styles.playlist}>
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className={styles.row}>
              <div className={styles.cellIcon}>
                <Skeleton width={51} height={51} borderRadius={0} />
              </div>
              <div className={styles.cellTitle}>
                <Skeleton height={24} width={`${60 + (i % 3) * 15}%`} />
              </div>
              <div className={styles.cellAuthor}>
                <Skeleton height={24} width={`${50 + (i % 2) * 20}%`} />
              </div>
              <div className={styles.cellAlbum}>
                <Skeleton height={24} width={`${40 + (i % 4) * 10}%`} />
              </div>
              <div className={styles.cellTime}>
                <Skeleton height={24} width={36} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
