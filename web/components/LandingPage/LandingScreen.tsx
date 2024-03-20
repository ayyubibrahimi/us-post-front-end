import React from 'react';
import { TypewriterEffectSmooth } from "./TypeWriter";
import styles from './LandingScreenLight.module.scss'; // Import the CSS module
import buttonStyles from './LandingScreenLight.module.scss'; // Import button styles

const LandingScreen = ({ onButtonClick }) => {
  const words = [
    { text: "Explore", textColor: '#000000' }, // Black text color
    { text: "peace", textColor: '#000000' },
    { text: "officer", textColor: '#000000' },
    { text: "employment", textColor: '#000000' },
    { text: "history", textColor: '#000000' },
    { text: "data", textColor: '#000000' },
    { text: "from", textColor: '#000000' },
    { text: "over", textColor: '#000000' },
    { text: "x", textColor: '#000000' },
    { text: "states", textColor: '#000000' },
  ];
  // const words = [
  //   { text: "Explore" }, // Black text color
  //   { text: "peace",  },
  //   { text: "officer", },
  //   { text: "employment", },
  //   { text: "history", },
  //   { text: "data", },
  //   { text: "from", },
  //   { text: "over",  },
  //   { text: "x", },
  //   { text: "states", },
  // ];
  
  return (
    <div className={`flex flex-col items-center justify-center h-screen space-y-4 ${styles.landingScreenContainer}`}>
      <p className={`${styles.peaceOfficerText} text-xs sm:text-base`}>
        Peace Officer Employment History Database
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button
          className={`${buttonStyles.georgiaButton}`}
          onClick={() => onButtonClick('Georgia')}>
          Georgia
        </button>
        <button
          className={`${buttonStyles.floridaButton}`}
          onClick={() => onButtonClick('Florida')}>
          Florida
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
