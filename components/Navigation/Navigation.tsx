'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navigation.module.css';
import { getAccessToken, clearTokens } from '@/lib/auth/token';
import { useAppDispatch } from '@/store/hooks';
import { setFavorites } from '@/store/slices/favoritesSlice';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, [pathname]);

  const handleLogout = () => {
    dispatch(setFavorites([]));
    clearTokens();
    setIsLoggedIn(false);
    router.push('/');
  };

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
            <Link href="/" className={styles.menuLink}>
              Главное
            </Link>
          </li>
          {isLoggedIn && (
            <li className={styles.menuItem}>
              <Link href="/favorites" className={styles.menuLink}>
                Мой плейлист
              </Link>
            </li>
          )}
          <li className={styles.menuItem}>
            {isLoggedIn ? (
              <button
                type="button"
                className={styles.menuLink}
                onClick={handleLogout}
              >
                Выйти
              </button>
            ) : (
              <Link href="/auth/signin" className={styles.menuLink}>
                Войти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
