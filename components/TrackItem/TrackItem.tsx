import Link from 'next/link';
import styles from './TrackItem.module.css';
import { Track } from '@/types/track';

interface TrackItemProps {
  track: Track;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function TrackItem({ track }: TrackItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.track}>
        <div className={styles.title}>
          <div className={styles.titleImage}>
            <svg className={styles.titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div className={styles.titleText}>
            <Link className={styles.titleLink} href="">
              {track.name}
            </Link>
          </div>
        </div>
        <div className={styles.author}>
          <Link className={styles.authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.album}>
          <Link className={styles.albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.time}>
          <svg className={styles.timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.timeText}>
            {formatDuration(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
