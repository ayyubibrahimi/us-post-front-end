import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AgencyTable from '../components/Pages/AgencyTable';
import { fetchAllAgencyData } from '../utils/fetchAllAgencies';
import LandingScreen from '../components/LandingPage/LandingScreen';

// Dynamically import the MapComponent with SSR disabled
const MapComponentWithNoSSR = dynamic(() => import('../components/Map/MapComponent'), {
  ssr: false,
});

export default function Home({ allAgencyData }) {
  const [selectedState] = useState('Arizona'); // Always set to 'Georgia'
  const [filteredData, setFilteredData] = useState([]);
  const [showLandingScreen, setShowLandingScreen] = useState(true);

  useEffect(() => {
    const data = allAgencyData.filter(agency => agency.state === selectedState);
    setFilteredData(data);
  }, [selectedState, allAgencyData]);

  const handleStateSelection = () => {
    setShowLandingScreen(false);
  };

  if (showLandingScreen) {
    return <LandingScreen onButtonClick={handleStateSelection} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow">
        <div>
          <AgencyTable agencyData={filteredData} />
        </div>
      </main>
    </div>
  );
}

// Fetch initial data
export async function getStaticProps() {
  const allAgencyData = await fetchAllAgencyData();
  return { props: { allAgencyData } };
}