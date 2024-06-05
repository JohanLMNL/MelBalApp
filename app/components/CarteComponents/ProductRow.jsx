import React from 'react';
import styles from './ProductRow.module.css';

const ProductRow = (props) => {
  return (
    <tr className={styles.cell}>
      <td>{props.nom}</td>
      <td>{props.categorie}</td>
      <td>{props.prix} €</td>
      <td>{props.update}</td>
      <td>{props.delete}</td>
    </tr>
  );
};

export default ProductRow;
