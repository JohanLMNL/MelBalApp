import React from 'react';
import styles from './input.module.css';

const Input = (props) => {
  
  const {
    width = '350px',
    name,
    type,
    placeholder,
    onChange,
    value,
  } = props;

  return (
    <input
      className={styles.primary}
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      style={{ width }}
    />
  );
};

export default Input;
