'use client';
import React from 'react';
import Link from 'next/link';
import styles from './MenuCard.module.css';

const MenuCard = (props) => {
  return (
    <Link href={props.link}>
      <div className={styles.MenuCard}>
        <div className={styles.icon}>{props.icon}</div>
        <div>{props.title}</div>
      </div>
    </Link>
  );
};

export default MenuCard;
