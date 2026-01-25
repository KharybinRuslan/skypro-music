'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Image
          src="/img/logo.png"
          alt="logo"
          width={113}
          height={17}
          className={styles.logoImage}
        />
      </div>
      <div className={styles.burger} onClick={toggleMenu}>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </div>
      <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href="#" className={styles.menuLink}>
              Главное
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="#" className={styles.menuLink}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/auth/signin" className={styles.menuLink}>
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
