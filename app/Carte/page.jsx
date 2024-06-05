'use client';
import React, { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import ProductRow from '../components/CarteComponents/ProductRow';
import { createClient } from '@supabase/supabase-js';

import {
  PlusIcon,
  UpdateIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
} from '@radix-ui/react-icons';

import styles from './Carte.module.css';
import GButton from '../components/ui/GButton';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader/Loader';
import Select from '../components/ui/Select';

const Carte = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [isLoading, setIsLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deleteProductName, setDeleteProductName] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [addProduct, setAddProduct] = useState({
    nom: '',
    categorie1: '',
    categorie2: '',
    categorie3: '',
    prix: '',
  });
  const [updateProduct, setUpdateProduct] = useState({
    nom: '',
    categorie1: '',
    categorie2: '',
    categorie3: '',
    prix: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const fetchProduits = async () => {
    try {
      setIsLoading(true);
      let { data, error } = await supabase
        .from('produits')
        .select('*');
      if (error) {
        console.error('Error fetching data:', error.message);
        setIsLoading(false);
      } else {
        data.sort((a, b) => a.categorie1.localeCompare(b.categorie1));
        setProduits(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setIsLoading(false);
    }
  };

  const validateDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error on deleting:', error.message);
      } else {
        setIsModalOpen(false);
        fetchProduits();
        console.log('produit supprimé');
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  const handleDeleteClick = (produit, id) => {
    setDeleteProductName(produit);
    setDeleteProductId(id);
    setIsModalOpen(true);
  };

  const handleAddProduct = async () => {
    if (
      addProduct.nom === '' ||
      addProduct.categorie1 === '' ||
      addProduct.prix === ''
    ) {
      setErrorMsg('Vous devez remplir tous les champs');
      return;
    } else if (
      produits.some(
        (produit) => produit.nom === addProduct.nom.toLowerCase()
      )
    ) {
      setErrorMsg('le produit existe déjà');
    } else {
      try {
        const { data, error } = await supabase
          .from('produits')
          .insert([
            {
              nom: addProduct.nom.toLowerCase(),
              categorie1: addProduct.categorie1,
              categorie2: addProduct.categorie2,
              categorie3: addProduct.categorie3,
              prix: addProduct.prix,
            },
          ])
          .select();

        if (error) {
          console.error("Erreur lors de l'ajout du produit:", error);
        } else {
          setErrorMsg('');
          setAddProduct({});
          setIsAddModalOpen(false);
          fetchProduits();
        }
      } catch (e) {
        console.error("Une erreur inattendue s'est produite:", e);
      }
    }
  };

  const handleModalUpdate = (
    id,
    nom,
    categorie1,
    categorie2,
    categorie3,
    prix
  ) => {
    setIsUpdateModalOpen(true);
    setUpdateProduct({
      id,
      nom,
      categorie1,
      categorie2,
      categorie3,
      prix,
    });
  };

  const handleUpdateProduct = async () => {
    if (
      updateProduct.nom === '' ||
      updateProduct.categorie1 === '' ||
      updateProduct.prix === ''
    ) {
      setErrorMsg('Vous devez remplir tous les champs');
      return;
    } else if (
      produits.some(
        (produit) => produit.nom === updateProduct.nom.toLowerCase()
      )
    ) {
      setErrorMsg('le produit existe déjà');
    } else {
      try {
        const { data, error } = await supabase
          .from('produits')
          .update({
            nom: updateProduct.nom.toLowerCase(),
            categorie1: updateProduct.categorie1,
            categorie2: updateProduct.categorie2,
            categorie3: updateProduct.categorie3,
            prix: updateProduct.prix,
          })
          .eq('id', updateProduct.id)
          .select();
        setErrorMsg('');
        setIsUpdateModalOpen(false);
        setUpdateProduct({});
        fetchProduits();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  return (
    <div>
      <Header />

      {isLoading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        <div className={styles.carte}>
          <div className={styles.functions}>
            <Input
              type='text'
              placeholder='Rechercher...'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.buttons}>
              <GButton
                startIcon={<PlusIcon />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Ajouter un Produit
              </GButton>
              <GButton
                style='secondary'
                startIcon={<UpdateIcon />}
                onClick={() => fetchProduits()}
              >
                Actualiser
              </GButton>
            </div>
          </div>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Modifier</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {searchTerm === ''
                ? produits.map((produit) => (
                    <ProductRow
                      key={produit.id}
                      nom={produit.nom}
                      categorie={produit.categorie1}
                      prix={produit.prix}
                      update={
                        <UpdateIcon
                          className={styles.updateIcon}
                          onClick={() =>
                            handleModalUpdate(
                              produit.id,
                              produit.nom,
                              produit.categorie1,
                              produit.categorie2,
                              produit.categorie3,
                              produit.prix
                            )
                          }
                        />
                      }
                      delete={
                        <Cross1Icon
                          className={styles.deleteIcon}
                          onClick={() =>
                            handleDeleteClick(produit.nom, produit.id)
                          }
                        />
                      }
                    />
                  ))
                : produits
                    .filter((produit) =>
                      produit.nom
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((produit) => (
                      <ProductRow
                        key={produit.id}
                        nom={produit.nom}
                        categorie={produit.categorie1}
                        prix={produit.prix}
                        update={
                          <UpdateIcon
                            className={styles.updateIcon}
                            onClick={() =>
                              handleModalUpdate(
                                produit.id,
                                produit.nom,
                                produit.categorie1,
                                produit.categorie2,
                                produit.categorie3,
                                produit.prix
                              )
                            }
                          />
                        }
                        delete={
                          <Cross1Icon
                            className={styles.deleteIcon}
                            onClick={() =>
                              handleDeleteClick(
                                produit.nom,
                                produit.id
                              )
                            }
                          />
                        }
                      />
                    ))}
            </tbody>
          </table>
        </div>
      )}
      {/* //////////DELETE/////////////// */}
      {isModalOpen && <div className={styles.overlay}></div>}
      {isModalOpen && (
        <div className={styles.modal}>
          <ExclamationTriangleIcon className={styles.modalIcon} />
          <p>
            Êtes-vous sur de vouloir supprimer{' '}
            <span className={styles.modalName}>
              {deleteProductName}
            </span>{' '}
            de la carte ?
          </p>
          <div className={styles.modalButtons}>
            <GButton
              style='secondary'
              onClick={() => setIsModalOpen(false)}
              startIcon={<ChevronLeftIcon />}
            >
              Retour
            </GButton>
            <GButton
              style='alert'
              endIcon={<Cross1Icon />}
              onClick={() => validateDelete(deleteProductId)}
            >
              Supprimer
            </GButton>
          </div>
        </div>
      )}
      {/* //////////ADD/////////////// */}
      {isAddModalOpen && <div className={styles.overlay}></div>}
      {isAddModalOpen && (
        <div className={styles.modal}>
          <p className={styles.modalTitle}>Nouveau Produit</p>
          <div className={styles.addModalInputs}>
            <Input
              placeholder='Nom'
              onChange={(e) =>
                setAddProduct({
                  ...addProduct,
                  nom: e.target.value,
                })
              }
            />
            <Select
              onChange={(e) =>
                setAddProduct({
                  ...addProduct,
                  categorie1: e.target.value,
                })
              }
              placeholder='Choisissez une Catégorie'
            >
              <option value=''>--Catégorie--</option>
              <option value='fooding'>Fooding</option>
              <option value='vin'>Vin</option>
              <option value='aperitifs'>Apéritifs</option>
              <option value='champagne'>Champagne</option>
              <option value='cocktail'>Cocktail</option>
              <option value='spritz'>Spritz</option>
              <option value='dry'>Dry</option>
              <option value='alcool'>Alcool</option>
              <option value='biere'>Bières</option>
              <option value='soft'>Softs</option>
              <option value='mocktail'>Mocktails</option>
              <option value='bouteille vin'>Bouteilles Vins</option>
              <option value='bouteille alcool'>
                Bouteilles Alcools
              </option>
              <option value='bouteille champagne'>
                Bouteilles Champagne
              </option>
            </Select>
            <Input
              placeholder='Catégorie 2'
              onChange={(e) =>
                setAddProduct({
                  ...addProduct,
                  categorie2: e.target.value,
                })
              }
            />
            <Input
              placeholder='Catégorie 3'
              onChange={(e) =>
                setAddProduct({
                  ...addProduct,
                  categorie3: e.target.value,
                })
              }
            />
            <Input
              placeholder='Prix'
              onChange={(e) =>
                setAddProduct({
                  ...addProduct,
                  prix: e.target.value,
                })
              }
            />
          </div>
          <p className={styles.errorMsg}>{errorMsg}</p>
          <div className={styles.modalButtons}>
            <GButton
              style='secondary'
              onClick={() => setIsAddModalOpen(false)}
              startIcon={<ChevronLeftIcon />}
            >
              Retour
            </GButton>
            <GButton
              endIcon={<PlusIcon />}
              onClick={() => handleAddProduct()}
            >
              Ajouter
            </GButton>
          </div>
        </div>
      )}
      {/* //////////UPDATE/////////////// */}
      {isUpdateModalOpen && <div className={styles.overlay}></div>}
      {isUpdateModalOpen && (
        <div className={styles.modal}>
          <p className={styles.modalTitle}>Modifier Le produit</p>
          <div className={styles.addModalInputs}>
            <Input
              value={updateProduct.nom}
              placeholder='Nom'
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  nom: e.target.value,
                })
              }
            />
            <Select
              value={updateProduct.categorie1}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  categorie1: e.target.value,
                })
              }
            >
              <option value='fooding'>Fooding</option>
              <option value='vin'>Vin</option>
              <option value='cocktail'>Cocktail</option>
              <option value='spritz'>Spritz</option>
              <option value='dry'>Dry</option>
              <option value='alcool'>Alcool</option>
              <option value='biere'>Bières</option>
              <option value='soft'>Softs</option>
              <option value='mocktail'>Mocktails</option>
              <option value='bouteilleA'>Bouteilles Alcools</option>
              <option value='bouteilleC'>Bouteilles Champagne</option>
            </Select>
            <Input
              placeholder='Catégorie 2'
              value={updateProduct.categorie2}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  categorie2: e.target.value,
                })
              }
            />
            <Input
              placeholder='Catégorie 3'
              value={updateProduct.categorie3}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  categorie3: e.target.value,
                })
              }
            />
            <Input
              placeholder='Prix'
              value={updateProduct.prix}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  prix: e.target.value,
                })
              }
            />
          </div>
          <p className={styles.errorMsg}>{errorMsg}</p>
          <div className={styles.modalButtons}>
            <GButton
              style='secondary'
              onClick={() => setIsUpdateModalOpen(false)}
              startIcon={<ChevronLeftIcon />}
            >
              Retour
            </GButton>
            <GButton
              endIcon={<PlusIcon />}
              onClick={() => handleUpdateProduct()}
            >
              Ajouter
            </GButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carte;
