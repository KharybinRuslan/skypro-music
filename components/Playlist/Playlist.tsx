import styles from './Playlist.module.css';
import TrackItem from '../TrackItem/TrackItem';
import { Track } from '@/types/track';

interface PlaylistProps {
  tracks: Track[];
}

export default function Playlist({ tracks }: PlaylistProps) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <div className={styles.col01}>Трек</div>
        <div className={styles.col02}>Исполнитель</div>
        <div className={styles.col03}>Альбом</div>
        <div className={styles.col04}>
          <svg className={styles.titleSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
          </svg>
        </div>
      </div>
      <div className={styles.playlist}>
        {tracks.map((track) => (
          <TrackItem key={track._id} track={track} playlist={tracks} />
        ))}
      </div>
    </div>
  );
}
