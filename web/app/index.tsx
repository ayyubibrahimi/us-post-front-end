import React from 'react';
import Header from '../components/Header/Header';
import dynamic from 'next/dynamic';
import AgencyBox from '../components/AgencyCards/AgencyBox';
import styles from './index.module.scss'; // Import the new SCSS module

// Dynamically import the MapComponent with SSR disabled
const MapComponentWithNoSSR = dynamic(() => import('../components/Map/MapComponent'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <MapComponentWithNoSSR />
        <AgencyBox />
      </main>
    </div>
  );
}
