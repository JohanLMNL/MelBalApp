import React from 'react';
import Link from 'next/link';
import styles from './menuBtn.module.css';

const MenuBtn = (props) => (
  <Link
    className={styles.btn}
    href={props.link}
  >
    <span className={styles.icon}>{props.icon}</span>
    <p>{props.children}</p>
  </Link>
);

export default MenuBtn;
