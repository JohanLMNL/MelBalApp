import React from 'react';
import styles from './Navbar.module.css';
import {
  ReaderIcon,
  PersonIcon,
  FileTextIcon,
} from '@radix-ui/react-icons';
import MenuBtn from './MenuBtn';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <MenuBtn
        link='/Menu'
        icon={<ReaderIcon />}
      >
        Menu
      </MenuBtn>
    </div>
  );
};

export default Navbar;
