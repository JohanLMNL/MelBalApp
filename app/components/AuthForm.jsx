'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from './ui/Input';
import GButton from './ui/GButton';
import Logo from './ui/Logo';

import styles from './AuthForm.module.css';

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errormsg, setErrormsg] = useState('');

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleLogin() {
    try {
      setErrormsg('');
      if (password === '' || email === '') {
        setErrormsg('Vous devez remplir tous les champs !');
        setEmail('');
        setPassword('');
        return;
      } else if (!isEmailValid(email)) {
        setErrormsg('Email invalide !');
        setEmail('');
        setPassword('');
        return;
      } else {
        const { user, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          setErrormsg("Nom d'utilisateur ou mot de passe incorrect");
          return;
        } else {
          router.push('/watch-list');
        }
      }
    } catch (error) {
      setErrormsg(
        "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
      );
      setEmail('');
      setPassword('');
    }
  }

  return (
    <div className={styles.Auth}>
      <Logo />
      <Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type='password'
        placeholder='Mot de passe'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p
        className={styles.forgotMail}
        onClick={() => router.push('/auth/resetPassword')}
      >
        Mot de passe oublié ?
      </p>
      <p className={styles.errormsg}>{errormsg}</p>
      <GButton onClick={() => handleLogin()}>Connexion</GButton>
    </div>
  );
}
