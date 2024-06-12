'use client';
import React, { useState, useEffect } from 'react';
import Header from '../components/ui/Header';
import { createClient } from '@supabase/supabase-js';
import { formatHeure } from '../components/utils/utilsFunction';
import { useRouter } from 'next/navigation';

import styles from './resas.module.css';
import Input from '../components/ui/Input';
import GButton from '../components/ui/GButton';
import { PlusIcon } from '@radix-ui/react-icons';
import MelButton from '../components/ui/RadioButtons/MelButton';
import BalButton from '../components/ui/RadioButtons/BalButton';
import ResaRow from '../components/ResasComponents/ResaRow';
import ResaRowOnPC from '../components/ResasComponents/ResaRowOnPC';

const Stats = () => {
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
  const Router = useRouter();

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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <div className={styles.resas}>
      <Header />
      <div className={styles.functions}>
        <div className={styles.salleBtn}>
          <MelButton
            onClick={handleTriMel}
            isClicked={tri.melkior}
          />
          <BalButton
            onClick={handleTriBal}
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
            onClick={() => Router.push('/resas/NouvelleResa')}
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
    </div>
  );
};

export default Stats;
