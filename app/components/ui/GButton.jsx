import React from 'react';
import styles from './GButton.module.css';

const GButton = ({
  style,
  onClick,
  startIcon,
  endIcon,
  children,
  width = '150px',
  ...props
}) => {
  const styleClassMapping = {
    primary: styles.GButton,
    secondary: styles.SButton,
    alert: styles.AButton,
  };

  const buttonClass = styleClassMapping[style] || styles.GButton;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      style={{ width }}
      {...props}
    >
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};

export default GButton;
