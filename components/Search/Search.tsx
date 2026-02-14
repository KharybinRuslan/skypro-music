'use client';

import styles from './Search.module.css';

interface SearchProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function Search({ value, onChange }: SearchProps) {
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className={styles.search}>
      <svg className={styles.searchSvg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.searchText}
        type="search"
        placeholder="Поиск"
        name="search"
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : ''}
        onChange={isControlled ? (e) => onChange(e.target.value) : undefined}
        readOnly={!isControlled}
        aria-label="Поиск по названию трека"
      />
    </div>
  );
}
