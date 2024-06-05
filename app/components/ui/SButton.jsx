import React from 'react';
import styles from './SButton.module.css';

const GButton = (props) => {
  return (
    <button
      className={styles.GButton}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default GButton;
