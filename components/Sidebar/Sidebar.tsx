import Image from 'next/image';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.personal}>
        <p className={styles.personalName}>Sergey.Ivanov</p>
        <div className={styles.icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.list}>
          <div className={styles.item}>
            <Link className={styles.link} href="#">
              <Image
                src="/img/playlist01.png"
                alt="day's playlist"
                fill
                loading="eager"
                style={{ objectFit: 'cover' }}
              />
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} href="#">
              <Image
                src="/img/playlist02.png"
                alt="day's playlist"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} href="#">
              <Image
                src="/img/playlist03.png"
                alt="day's playlist"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
