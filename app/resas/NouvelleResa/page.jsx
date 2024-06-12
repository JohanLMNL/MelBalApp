'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

import styles from './NouvelleResa.module.css';
import { ChevronLeftIcon, PlusIcon } from '@radix-ui/react-icons';

import Header from '@/app/components/ui/Header';
import MelButton from '@/app/components/ui/RadioButtons/MelButton';
import BalButton from '@/app/components/ui/RadioButtons/BalButton';
import Input from '@/app/components/ui/Input';
import TextArea from '@/app/components/ui/TextArea';
import GButton from '@/app/components/ui/GButton';

const NouvelleResa = () => {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [isMelkior, setIsMelkior] = useState(false);
  const [isBalta, setIsBalta] = useState(false);
  const [isError, setIsError] = useState(false);

  const [resaData, setResaData] = useState({
    salle: null,
    nom: null,
    tel: null,
    nombre: null,
    date: null,
    heure: null,
    acompte: null,
    commentaire: null,
    table: null,
  });

  const handleClickMel = () => {
    setIsBalta(false);
    setIsMelkior(true);
    setResaData((prevResaData) => {
      return { ...prevResaData, salle: 'melkior' };
    });
  };

  const handleClickBal = () => {
    setIsMelkior(false);
    setIsBalta(true);
    setResaData((prevResaData) => {
      return { ...prevResaData, salle: 'baltazar' };
    });
  };

  const handleSendResa = async () => {
    if (
      resaData.nom === null ||
      resaData.salle === null ||
      resaData.date === null ||
      resaData.nombre === null ||
      resaData.nom === '' ||
      resaData.salle === '' ||
      resaData.date === '' ||
      resaData.nombre === ''
    ) {
      setIsError(true);
    } else {
      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            salle: resaData.salle,
            nom: resaData.nom,
            tel: resaData.tel,
            nombre: resaData.nombre,
            date: resaData.date,
            heure: resaData.heure,
            acompte: resaData.acompte,
            commentaire: resaData.commentaire,
            table: resaData.table,
          },
        ]);

      if (error) {
        console.error('Erreur lors de linsertion:', error);
      } else {
        console.log('Données insérées avec succès:', data);
        router.push('/resas');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.form}>
        <p className={styles.title}>Nouvelle Réservation</p>
        <div className={styles.radio}>
          <MelButton
            onClick={() => handleClickMel()}
            isClicked={isMelkior}
          />
          <BalButton
            onClick={() => handleClickBal()}
            isClicked={isBalta}
          />
        </div>
        <div className={styles.inputs}>
          <label>Nom*</label>
          <Input
            type='text'
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                nom: e.target.value,
              }))
            }
          />
          <label>Telephone</label>
          <Input
            type='tel'
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                tel: e.target.value,
              }))
            }
          />
          <label>Nombre de Personnes*</label>
          <Input
            type='number'
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
          />
          <div className={styles.dateEtHeure}>
            <div className={styles.inputBlock}>
              <label>Date*</label>
              <Input
                type='date'
                width='150px'
                onChange={(e) =>
                  setResaData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
            <div className={styles.inputBlock}>
              <label>Heure</label>
              <Input
                type='time'
                width='150px'
                onChange={(e) =>
                  setResaData((prev) => ({
                    ...prev,
                    heure: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <label>Commentaire</label>
          <TextArea
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                commentaire: e.target.value,
              }))
            }
          />
          <div className={styles.dateEtHeure}>
            <div className={styles.inputBlock}>
              <label>Acompte</label>
              <Input
                type='number'
                width='150px'
                onChange={(e) =>
                  setResaData((prev) => ({
                    ...prev,
                    acompte: e.target.value,
                  }))
                }
              />
            </div>
            <div className={styles.inputBlock}>
              <label>Table</label>
              <Input
                type='number'
                width='150px'
                onChange={(e) =>
                  setResaData((prev) => ({
                    ...prev,
                    table: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        {isError === true && (
          <p className={styles.errormsg}>
            Vous devez remplir tous les champs
          </p>
        )}
        <div className={styles.buttons}>
          <GButton
            style='secondary'
            onClick={() => router.push('/resas')}
            startIcon={<ChevronLeftIcon />}
          >
            Retour
          </GButton>
          <GButton
            endIcon={<PlusIcon />}
            onClick={() => handleSendResa()}
          >
            Ajouter
          </GButton>
        </div>
      </div>
    </div>
  );
};

export default NouvelleResa;
