import styles from './Playlist.module.css';
import TrackItem from '../TrackItem/TrackItem';

export default function Playlist() {
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
        <TrackItem
          name="Guilt"
          author="Nero"
          album="Welcome Reality"
          duration="4:44"
        />
        <TrackItem
          name="Elektro"
          author="Dynoro, Outwork, Mr. Gee"
          album="Elektro"
          duration="2:22"
        />
        <TrackItem
          name="I'm Fire"
          author="Ali Bakgor"
          album="I'm Fire"
          duration="2:22"
        />
        <TrackItem
          name="Non Stop"
          author="Стоункат, Psychopath"
          album="Non Stop"
          duration="4:12"
          nameSpan="(Remix)"
        />
        <TrackItem
          name="Run Run"
          author="Jaded, Will Clarke, AR/CO"
          album="Run Run"
          duration="2:54"
          nameSpan="(feat. AR/CO)"
        />
      </div>
    </div>
  );
}
