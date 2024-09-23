import React from 'react';
import styles from './plan.module.css';
import { CrossCircledIcon } from '@radix-ui/react-icons';

const BaltaModal = (props) => {
  return (
    <div className={styles.modal}>
      <div
        className={styles.closeButton}
        onClick={props.onClick}
      >
        <CrossCircledIcon />
      </div>
      <div>
        <p className={styles.title}>Bal'tazar</p>
      </div>
      <div className={styles.imgContainer}>
        <img
          src='/plansDeSalle/PlanTableBalta.svg'
          className={styles.plan}
        />
      </div>
    </div>
  );
};

export default BaltaModal;
