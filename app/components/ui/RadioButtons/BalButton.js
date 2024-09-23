import React, { useState } from 'react';
import Image from 'next/image';
import styles from './MelButtons.module.css';

const BalButton = ({ onClick, isClicked }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div
      className={isClicked ? styles.buttonClicked : styles.button}
      onClick={handleClick}
    >
      <img
        className={styles.mellogo}
        src='/logoBalButtons.svg'
        alt='Logo Bal'
        width={20}
        height={20}
      />
      <p>Bal'tazar</p>
    </div>
  );
};

export default BalButton;
