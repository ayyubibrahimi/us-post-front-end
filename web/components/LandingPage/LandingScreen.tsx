import React from 'react';
import { TypewriterEffectSmooth } from "./TypeWriter";
import styles from './LandingScreenLight.module.scss';
import buttonStyles from './LandingScreenLight.module.scss';

const LandingScreen = ({ onButtonClick }) => {
  const words = [
    { text: "Explore", textColor: '#000000' },
    { text: "peace", textColor: '#000000' },
    { text: "officer", textColor: '#000000' },
    { text: "employment", textColor: '#000000' },
    { text: "history", textColor: '#000000' },
    { text: "data", textColor: '#000000' }
  ];

  const states = [
    "Washington", "Virginia", "Texas", "Tennessee", "South Carolina",
    "Oregon", "Ohio", "Maryland", "Illinois", "Georgia", "Florida",
    "California", "Arizona"
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen space-y-4 ${styles.landingScreenContainer}`}>
      <p className={`${styles.peaceOfficerText} text-xs sm:text-base`}>
        Peace Officer Employment History Database
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {states.map((state) => (
          <button
            key={state}
            className={`${buttonStyles.georgiaButton}`}
            onClick={() => onButtonClick(state)}
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingScreen;