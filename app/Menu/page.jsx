import React from 'react';
import {
  BookmarkFilledIcon,
  HomeIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import MenuCard from '../components/MenuComponents/MenuCard';
import Header from '../components/ui/Header';

import styles from './Menu.module.css';

const Menu = () => {
  return (
    <div>
      <Header />
      <div className={styles.bigBtn}>
        <MenuCard
          icon={<HomeIcon />}
          title='Home'
          link='/'
        />
        <MenuCard
          icon={<BookmarkFilledIcon />}
          title='Réservations'
          link='/resas'
        />
        <MenuCard
          icon={<HamburgerMenuIcon />}
          title='Carte'
          link='/Carte'
        />
      </div>
    </div>
  );
};

export default Menu;
