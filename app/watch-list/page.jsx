import React from 'react';
import Header from '../components/ui/Header';
import styles from './watch-list.module.css';
import ResasBalta from '../components/Home/ResasBalta';
import ResaMel from '../components/Home/ResaMel';
import { Label } from '@headlessui/react';

const WatchList = () => {
  return (
    <div>
      <Header />
      <div className={styles.home}>
        <h1>Welcome.</h1>
        <ResaMel />
        <ResasBalta />
      </div>
    </div>
  );
};

export default WatchList;
