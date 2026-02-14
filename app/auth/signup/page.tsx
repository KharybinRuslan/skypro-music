'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import styles from './signup.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { signup as apiSignup } from '@/lib/api/client';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    const username = email.split('@')[0] || email;
    setLoading(true);
    try {
      await apiSignup({ email, password, username });
      router.push('/auth/signin');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={handleSubmit}>
            <Link href="/">
              <div className={styles.modal__logo}>
                <Image
                  src="/img/logo_modal.png"
                  alt="logo"
                  width={250}
                  height={170}
                />
              </div>
            </Link>
            <input
              className={classNames(styles.modal__input, styles.login)}
              type="email"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className={styles.modal__input}
              type="password"
              name="repeatPassword"
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className={styles.modal__btnSignupEnt}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
