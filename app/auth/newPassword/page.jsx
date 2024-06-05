'use client';
import React from 'react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isEmailValid } from '@/app/components/utils/utilsFunction';
import { useRouter } from 'next/navigation';

import GButton from '@/app/components/ui/GButton';
import Input from '@/app/components/ui/Input';

import styles from './newPassword.module.css';

const newPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifPassword, setVerifPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleNewPassword() {
    if (email === '' || password === '' || verifPassword === '') {
      setErrorMsg('Vous devez remplir tous les champs !');
      return;
    } else if (!isEmailValid(email)) {
      setErrorMsg("Votre email n'est pas valide !");
    } else if (password !== verifPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas !');
      return;
    } else {
      try {
        const { data, error } = await supabase.auth.updateUser({
          email,
          password,
        });
        setErrorMsg('');
        router.push('/');
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la mise à jour du mot de passe :",
          error
        );
      }
    }
  }

  return (
    <div className={styles.newPassword}>
      <div>
        <h1 className={styles.titre}>Réinitialiser</h1>
        <p className={styles.password}>le mot de passe</p>
      </div>

      <Input
        type='email'
        placeholder='email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type='password'
        placeholder='mot de passe'
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type='password'
        placeholder='confirmez le mot de passe'
        onChange={(e) => setVerifPassword(e.target.value)}
      />
      <p className={styles.errorMsg}>{errorMsg}</p>
      <GButton onClick={() => handleNewPassword()}>Envoyer</GButton>
    </div>
  );
};

export default newPassword;
