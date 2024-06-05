import React from 'react';
import styles from './TextArea.module.css';

const TextArea = (props) => {
  return (
    <textarea
      className={styles.primary}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
    />
  );
};

export default TextArea;
