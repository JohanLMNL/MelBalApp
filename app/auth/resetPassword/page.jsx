'use client';
import React from 'react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isEmailValid } from '@/app/components/utils/utilsFunction';
import { useRouter } from 'next/navigation';
import GButton from '@/app/components/ui/GButton';
import SButton from '@/app/components/ui/SButton';
import Input from '@/app/components/ui/Input';

import styles from './resetPassword.module.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClientComponentClient();
  const router = useRouter();

  async function resetPassword() {
    if (!isEmailValid(email)) {
      setErrorMsg("Votre Email n'est pas valide !");
      return;
    } else {
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:3000/auth/newPassword',
        });
        setErrorMsg('');
        setSuccess(true);
      } catch (error) {
        setErrorMsg("Votre email n'est pas reconnu");
      }
    }
  }

  return (
    <div className={styles.reset}>
      <div>
        <h1 className={styles.titre}>Rénitialiser</h1>
        <p className={styles.password}>le mot de passe</p>
      </div>
      <p className={styles.txt}>
        Merci d'indiquer votre adresse mail
      </p>
      <Input
        type='email'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <p className={styles.errorMsg}>{errorMsg}</p>
      {success && (
        <p className={styles.successMsg}>
          Si vous êtes inscrit un email vous à été envoyé à l'adresse
          suivante : {email}
        </p>
      )}
      {success ? (
        <SButton onClick={() => router.push('/')}>Retour</SButton>
      ) : (
        <GButton onClick={() => resetPassword()}>Envoyer</GButton>
      )}
    </div>
  );
};

export default ResetPassword;
