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
                className={styles.img}
                src="/img/playlist01.png"
                alt="day's playlist"
                width={250}
                height={170}
                loading="eager"
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} href="#">
              <Image
                className={styles.img}
                src="/img/playlist02.png"
                alt="day's playlist"
                width={250}
                height={170}
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} href="#">
              <Image
                className={styles.img}
                src="/img/playlist03.png"
                alt="day's playlist"
                width={250}
                height={170}
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
