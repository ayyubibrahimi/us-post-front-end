import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import dynamic from 'next/dynamic';
// import AgencyBox from '../components/AgencyCards/AgencyBox';
import AgencyTable from '../components/Pages/AgencyTable';
import { fetchAllAgencyData } from '../utils/fetchAllAgencies';
import LandingScreen from '../components/LandingPage/LandingScreen'; // Ensure this is correctly imported

// Dynamically import the MapComponent with SSR disabled
const MapComponentWithNoSSR = dynamic(() => import('../components/Map/MapComponent'), {
  ssr: false,
});

export default function Home({ allAgencyData }) {
  const [selectedState, setSelectedState] = useState(''); // Initially empty
  const [filteredData, setFilteredData] = useState([]);
  const [showLandingScreen, setShowLandingScreen] = useState(true); // Control display of the LandingScreen

  useEffect(() => {
    const data = allAgencyData.filter(agency => agency.state === selectedState);
    setFilteredData(data);
  }, [selectedState, allAgencyData]);

  const handleStateSelection = (state) => {
    setSelectedState(state);
    setShowLandingScreen(false);
  };

  if (showLandingScreen) {
    return <LandingScreen onButtonClick={handleStateSelection} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header changeState={setSelectedState} />
      <main className="flex-grow">
        <div > 
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
