import React from 'react';
import styles from './Select.module.css';

const Select = (props) => {
  return (
    <select
      className={styles.select}
      value={props.value}
      onChange={props.onChange}
    >
      {props.children}
    </select>
  );
};

export default Select;
