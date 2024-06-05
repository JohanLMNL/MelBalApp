import React from 'react';
import styles from './ResaRow.module.css';
import Image from 'next/image';

const ResaRow = (props) => {
  return (
    <div
      className={styles.resaRow}
      onClick={props.onClick}
    >
      <div className={styles.logo}>
        {props.salle === 'baltazar' ? (
          <Image
            src='/LogoBalButtons.svg'
            width='20'
            height='20'
          />
        ) : (
          <Image
            src='/LogoMelButtons.svg'
            width='20'
            height='20'
          />
        )}
      </div>
      <div className={styles.nombre}>{props.nombre}</div>
      <div className={styles.heure}>{props.heure}</div>
      <div className={styles.nom}>{props.nom}</div>
      <div className={styles.table}>{props.table}</div>
    </div>
  );
};

export default ResaRow;
