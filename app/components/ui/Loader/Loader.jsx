import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div>
      <object
        className={styles.loader}
        type='image/svg+xml'
        data='/LogoMel.svg'
      >
        loading...
      </object>
    </div>
  );
};

export default Loader;
