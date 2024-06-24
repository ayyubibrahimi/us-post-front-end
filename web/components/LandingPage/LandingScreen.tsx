import React from 'react';
import { TypewriterEffectSmooth } from "./TypeWriter";
import styles from './LandingScreenLight.module.scss';
import buttonStyles from './LandingScreenLight.module.scss';

interface LandingScreenProps {
  onButtonClick: (state: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onButtonClick }) => {
  const words = [
    { text: "Explore", textColor: '#000000' },
    { text: "peace", textColor: '#000000' },
    { text: "officer", textColor: '#000000' },
    { text: "employment", textColor: '#000000' },
    { text: "history", textColor: '#000000' },
    { text: "data", textColor: '#000000' }
  ];

  const states = [
    "Arizona", "California", "Florida", "Georgia", "Illinois", "Maryland",
    "Ohio", "Oregon", "South Carolina", "Tennessee", "Texas", "Vermont",
    "Washington"
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen space-y-4 ${styles.landingScreenContainer}`}>
      <p className={`${styles.peaceOfficerText} text-xs sm:text-base`}>
        Peace Officer Employment History Database
      </p>
      <TypewriterEffectSmooth
        words={words}
        className={`text-2xl md:text-4xl lg:text-5xl font-bold text-center ${styles.typewriterBase}`}
        cursorClassName={`w-2 h-8 md:h-10 lg:h-12 ${styles.black}`}
      />
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