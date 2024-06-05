'use client';
import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './Header.module.css';
import { ExitIcon } from '@radix-ui/react-icons';
import Logo from './Logo';
import { useRouter } from 'next/navigation';
import Navbar from './nav/Navbar';

const Header = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogOut = async () => {
    let { error } = await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div>
    <div className={styles.header}>
      <Logo />
      <ExitIcon
        className={styles.exit}
        onClick={() => handleLogOut()}
      />
    </div>
    <Navbar/>
    </div>
  );
};

export default Header;
