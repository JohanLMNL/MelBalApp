import React from 'react';
import styles from './input.module.css';

const Input = (props) => {
  return (
    <input
      className={styles.primary}
      name={props.name}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
    />
  );
};

export default Input;
