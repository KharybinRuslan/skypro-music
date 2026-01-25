import Link from 'next/link';
import styles from './TrackItem.module.css';

interface TrackItemProps {
  name: string;
  author: string;
  album: string;
  duration: string;
  nameSpan?: string;
}

export default function TrackItem({
  name,
  author,
  album,
  duration,
  nameSpan,
}: TrackItemProps) {
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
              {name}{' '}
              {nameSpan && <span className={styles.titleSpan}>{nameSpan}</span>}
            </Link>
          </div>
        </div>
        <div className={styles.author}>
          <Link className={styles.authorLink} href="">
            {author}
          </Link>
        </div>
        <div className={styles.album}>
          <Link className={styles.albumLink} href="">
            {album}
          </Link>
        </div>
        <div className={styles.time}>
          <svg className={styles.timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.timeText}>{duration}</span>
        </div>
      </div>
    </div>
  );
}
