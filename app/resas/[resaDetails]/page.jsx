'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';

import Header from '@/app/components/ui/Header';
import Input from '@/app/components/ui/Input';
import GButton from '@/app/components/ui/GButton';
import TextArea from '@/app/components/ui/TextArea';
import MelButton from '@/app/components/ui/RadioButtons/MelButton';
import BalButton from '@/app/components/ui/RadioButtons/BalButton';
import {
  ChevronLeftIcon,
  PlusIcon,
  Cross1Icon,
} from '@radix-ui/react-icons';

import styles from './resaDetails.module.css';
import { commaDecimal } from 'validator/lib/alpha';

const resaDetails = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const id = useParams();
  const [isMelkior, setIsMelkior] = useState(false);
  const [isBalta, setIsBalta] = useState(false);

  const [resaData, setResaData] = useState({
    id: null,
    salle: null,
    nom: null,
    nombre: null,
    date: null,
    heure: null,
    acompte: null,
    commentaire: null,
    table: null,
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', id.resaDetails);

        if (error) throw error;
        setReservations(data);

        if (data && data.length > 0) {
          const reservation = data[0];
          setResaData({
            id: reservation.id,
            salle: reservation.salle,
            nom: reservation.nom,
            nombre: reservation.nombre,
            date: reservation.date,
            heure: reservation.heure,
            acompte: reservation.acompte,
            commentaire: reservation.commentaire,
            table: reservation.table,
          });
        }
        console.log(resaData.salle);
        if (data[0].salle == 'melkior') {
          setIsMelkior(true);
        } else {
          setIsBalta(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservations();
  }, []);

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

  const deleteResaById = async (resaId) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', resaId);
      if (error == null) {
        router.push('/resas');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateResaById = async (resaId) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({
          nom: resaData.nom,
          salle: resaData.salle,
          nombre: resaData.nombre,
          date: resaData.date,
          heure: resaData.heure,
          acompte: resaData.acompte,
          commentaire: resaData.commentaire,
          table: resaData.table,
        })
        .eq('id', resaId)
        .select();

      if (error == null) {
        router.push('/resas');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.form}>
        <div className={styles.salleBtn}>
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
          <Input
            type='text'
            value={resaData.nom}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                nom: e.target.value,
              }))
            }
          />
          <Input
            type='number'
            value={resaData.nombre}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
          />
          <Input
            type='date'
            value={resaData.date}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
          />
          <Input
            type='time'
            value={resaData.heure}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                heure: e.target.value,
              }))
            }
          />
          <Input
            type='number'
            value={resaData.acompte}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                acompte: e.target.value,
              }))
            }
          />
          <TextArea
            value={resaData.commentaire}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                commentaire: e.target.value,
              }))
            }
          />
          <Input
            type='number'
            value={resaData.table}
            onChange={(e) =>
              setResaData((prev) => ({
                ...prev,
                table: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.actionBtn}>
          <GButton
            style='secondary'
            onClick={() => router.push('/resas')}
            startIcon={<ChevronLeftIcon />}
          >
            Retour
          </GButton>
          <GButton
            style='alert'
            onClick={() => deleteResaById(resaData.id)}
            endIcon={<Cross1Icon />}
          >
            Supprimer
          </GButton>
          <GButton
            onClick={() => updateResaById(resaData.id)}
            endIcon={<PlusIcon />}
          >
            Modifier
          </GButton>
        </div>
      </div>
    </div>
  );
};

export default resaDetails;
