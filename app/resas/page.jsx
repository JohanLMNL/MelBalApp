'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Header from '../components/ui/Header';
import { createClient } from '@supabase/supabase-js';
import { formatHeure } from '../components/utils/utilsFunction';
import { useRouter } from 'next/navigation';

import styles from './resas.module.css';
import Input from '../components/ui/Input';
import GButton from '../components/ui/GButton';

import {
  PlusIcon,
  ChevronLeftIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import MelButton from '../components/ui/RadioButtons/MelButton';
import BalButton from '../components/ui/RadioButtons/BalButton';
import TextArea from '../components/ui/TextArea';
import ResaRow from '../components/ResasComponents/ResaRow';
import ResaRowOnPC from '../components/ResasComponents/ResaRowOnPC';

const Stats = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const Router = useRouter();
  ///BDD RESAS///
  const [tri, setTri] = useState({
    balta: true,
    melkior: true,
    date: new Date().toISOString().slice(0, 10),
    nom: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filteredResas, setFilteredResas] = useState([]);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*');

        if (error) throw error;

        setReservations(data);
      } catch (error) {
        setError('Erreur lors de la récupération des réservations');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [reloadCounter]);

  useEffect(() => {
    const filterReservations = () => {
      return reservations.filter((reservation) => {
        const filterBySalle =
          (tri.balta && reservation.salle === 'baltazar') ||
          (tri.melkior && reservation.salle === 'melkior');
        const filterByName = tri.nom
          ? reservation.nom
              .toLowerCase()
              .includes(tri.nom.toLowerCase())
          : true;
        const filterByDate = tri.date
          ? reservation.date === tri.date
          : true;
        return filterBySalle && filterByDate && filterByName;
      });
    };
    const filteredReservations = filterReservations();
    setFilteredResas(filteredReservations);
  }, [tri, reservations]);

  ///GESTION TAILLE ECRAN ///

  function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      const listener = () => setMatches(media.matches);

      setMatches(media.matches);

      media.addListener(listener);

      return () => media.removeListener(listener);
    }, [query]);

    return matches;
  }

  const isMobile = useMediaQuery('(max-width: 768px)');

  ///GESTION ADD RESAS///
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [isMelkior, setIsMelkior] = useState(false);
  const [isBalta, setIsBalta] = useState(false);

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

  const handleTriMel = () => {
    setTri((prevTri) => ({
      ...prevTri,
      melkior: !prevTri.melkior,
    }));
  };

  const handleTriBal = () => {
    setTri((prevTri) => ({
      ...prevTri,
      balta: !prevTri.balta,
    }));
  };

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
    console.log('Nom :' + resaData.nom + 'salle :' + resaData.salle);
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
        handleResetResa();
        setIsAddModalOpen(false);
        setReloadCounter((prev) => prev + 1);
      }
    }
  };

  const handleResetResa = () => {
    setResaData({
      salle: null,
      nom: null,
      nombre: null,
      date: null,
      heure: null,
      acompte: null,
      commentaire: null,
      table: null,
    });

    setIsBalta(false);
    setIsMelkior(false);
    setIsAddModalOpen(false);
  };

  return (
    <div className={styles.resas}>
      <Header />
      <div className={styles.functions}>
        <div className={styles.salleBtn}>
          <MelButton
            onClick={() => handleTriMel()}
            isClicked={tri.melkior}
          />
          <BalButton
            onClick={() => handleTriBal()}
            isClicked={tri.balta}
          />
        </div>
        <div className={styles.inputs}>
          <div>
            <Input
              type='text'
              placeholder='Rechercher...'
              onChange={(e) =>
                setTri((prevTri) => ({
                  ...prevTri,
                  nom: e.target.value,
                  date: '',
                }))
              }
            />
          </div>
          <div>
            <Input
              type='date'
              value={tri.date}
              onChange={(e) =>
                setTri((prevTri) => ({
                  ...prevTri,
                  date: e.target.value,
                  nom: '',
                }))
              }
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <GButton
            startIcon={<PlusIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Ajouter une Résa
          </GButton>
        </div>
      </div>
      <div>
        {loading ? (
          <p>Chargement des réservations...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredResas.length === 0 ? (
          <div>
            <p>Il n'y a pas de réservation pour ce jour</p>
          </div>
        ) : (
          filteredResas.map((resa) =>
            isMobile ? (
              <ResaRow
                key={resa.id}
                salle={resa.salle}
                nombre={resa.nombre}
                heure={
                  resa.heure == null
                    ? '--:--'
                    : formatHeure(resa.heure)
                }
                nom={resa.nom}
                table={resa.table == null ? '-' : resa.table}
                onClick={() => Router.push(`/resas/${resa.id}`)}
              />
            ) : (
              <ResaRowOnPC
                key={resa.id}
                onClick={() => Router.push(`/resas/${resa.id}`)}
                salle={resa.salle}
                nombre={resa.nombre}
                heure={
                  resa.heure == null
                    ? '--:--'
                    : formatHeure(resa.heure)
                }
                nom={resa.nom}
                acompte={resa.acompte == null ? '0' : resa.acompte}
                commentaire={resa.commentaire}
                table={resa.table == null ? '-' : resa.table}
              />
            )
          )
        )}
      </div>

      {isAddModalOpen && <div className={styles.overlay}></div>}
      {isAddModalOpen && (
        <div className={styles.modal}>
          <p className={styles.modalTitle}>Nouvelle Réservation</p>
          <div className={styles.modalRadio}>
            <MelButton
              onClick={() => handleClickMel()}
              isClicked={isMelkior}
            />
            <BalButton
              onClick={() => handleClickBal()}
              isClicked={isBalta}
            />
          </div>
          <div className={styles.modalInputs}>
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
            <label>Date*</label>
            <Input
              type='date'
              onChange={(e) =>
                setResaData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />
            <label>Heure</label>
            <Input
              type='time'
              onChange={(e) =>
                setResaData((prev) => ({
                  ...prev,
                  heure: e.target.value,
                }))
              }
            />
            <label>Acompte</label>
            <Input
              type='number'
              onChange={(e) =>
                setResaData((prev) => ({
                  ...prev,
                  acompte: e.target.value,
                }))
              }
            />
            <label>Commentaire</label>
            <TextArea
              onChange={(e) =>
                setResaData((prev) => ({
                  ...prev,
                  commentaire: e.target.value,
                }))
              }
            />
            <label>Table</label>
            <Input
              type='number'
              onChange={(e) =>
                setResaData((prev) => ({
                  ...prev,
                  table: e.target.value,
                }))
              }
            />
          </div>
          {isError === true && (
            <p className={styles.errormsg}>
              Vous devez remplir tous les champs
            </p>
          )}
          <div className={styles.modalButtons}>
            <GButton
              style='secondary'
              onClick={() => handleResetResa()}
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
      )}
    </div>
  );
};

export default Stats;
