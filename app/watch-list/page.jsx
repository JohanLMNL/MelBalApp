import React from 'react';
import Header from '../components/ui/Header';
import styles from './watch-list.module.css';
import ResasBalta from '../components/Home/ResasBalta';
import ResaMel from '../components/Home/ResaMel';

const WatchList = () => {
  return (
    <div>
      <Header />
      <div className={styles.home}>
        <h1>Welcome.</h1>
        <ResaMel />
        <ResasBalta />
        <p>v.0.1.2</p>
      </div>
    </div>
  );
};

export default WatchList;
