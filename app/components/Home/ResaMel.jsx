'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import styles from './ResaBalta.module.css';
import { useRouter } from 'next/navigation';

const ResaMel = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const router = useRouter();

  const [reservations, setReservations] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);

      // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
      const today = new Date().toISOString().slice(0, 10);

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('salle', 'melkior')
          .eq('date', today);
        if (error) throw error;

        // Ici, on stocke seulement le nombre de réservations
        setReservations(data.length);
      } catch (error) {
        setError('Erreur lors de la récupération des réservations');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div
      className={styles.resasBalta}
      onClick={() => router.push('/resas')}
    >
      <div className={styles.logo}>
        <Image
          src='/LogoMelButtons.svg'
          width='40'
          height='40'
        />
      </div>
      <div className={styles.txt}>{reservations} Réservations</div>
    </div>
  );
};

export default ResaMel;
