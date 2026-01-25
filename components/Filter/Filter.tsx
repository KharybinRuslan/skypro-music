import styles from './Filter.module.css';

export default function Filter() {
  return (
    <div className={styles.filter}>
      <div className={styles.filterTitle}>Искать по:</div>
      <div className={styles.filterButton}>исполнителю</div>
      <div className={styles.filterButton}>году выпуска</div>
      <div className={styles.filterButton}>жанру</div>
    </div>
  );
}
