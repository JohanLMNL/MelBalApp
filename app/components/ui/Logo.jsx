import React from 'react';
import styles from './Logo.module.css';
import Link from 'next/link';

const Logo = () => {
  return (
    <div>
      <Link
        href='/watch-list'
        className={styles.Logo}
      >
        <h1>MelBal.</h1>
        <p className={styles.dash}>Dashboard</p>
      </Link>
    </div>
  );
};

export default Logo;
