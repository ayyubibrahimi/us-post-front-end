import React from 'react';
import { useRouter } from 'next/router';
import LandingScreen from '../components/LandingPage/LandingScreen';
import styles from './index.module.scss';

export default function Home() {
  const router = useRouter();

  const handleStateSelection = (state: string) => {
    router.push(`/state/${state}`);
  };

  return (
    <div className={`${styles.pageContainer} flex flex-col h-screen`}>
      <main className="flex-grow">
        <LandingScreen onButtonClick={handleStateSelection} />
      </main>
    </div>
  );
}