import React from 'react';
import styles from './GButton.module.css';

const GButton = (props) => {
  const styleClassMapping = {
    primary: styles.GButton,
    secondary: styles.SButton,
    alert: styles.AButton,
  };

  const buttonClass =
    styleClassMapping[props.style] || styles.GButton;

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
    >
      {props.startIcon}
      {props.children}
      {props.endIcon}
    </button>
  );
};

export default GButton;
