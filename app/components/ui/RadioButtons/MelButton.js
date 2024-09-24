import React from 'react';
import Image from 'next/image';
import styles from './MelButtons.module.css';

const MelButton = ({ onClick, isClicked }) => {
  const handleClick = () => {
    onClick(); // Appel de la fonction fournie par le composant parent
  };

  return (
    <div
      className={isClicked ? styles.buttonClicked : styles.button}
      onClick={handleClick}
    >
      <Image
        className={styles.mellogo}
        src='/logoMelButtons.svg'
        alt='Logo Mel'
        width={20}
        height={20}
      />
      <p>Melkior</p>
    </div>
  );
};

export default MelButton;
