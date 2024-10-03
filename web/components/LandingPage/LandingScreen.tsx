import React, { useState } from "react";
import { TypewriterEffectSmooth } from "./TypeWriter";
import styles from "./LandingScreenLight.module.scss";
import buttonStyles from "./LandingScreenLight.module.scss";
import LouisianaModal from "./LouisianaModal";

interface LandingScreenProps {
  onButtonClick: (state: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onButtonClick }) => {
  const [isLouisianaModalOpen, setIsLouisianaModalOpen] = useState(false);

  const words = [
    {
      text: "Explore",
      textColor: "#000000",
      className: "font-['SF_Pro', 'SF_Pro_Display', 'SF_Pro_Rounded', 'Arial']",
    },
    {
      text: "police",
      textColor: "#000000",
      className: "font-['SF_Pro', 'SF_Pro_Text', 'SF_Pro_Rounded']",
    },
    {
      text: "officer",
      textColor: "#000000",
      className: "font-['SF_Pro', 'SF_Pro_Display', 'SF_Pro_Text']",
    },
    {
      text: "employment",
      textColor: "#000000",
      className: "font-['SF_Pro', 'SF_Pro_Rounded', 'SF_Pro_Display']",
    },
    {
      text: "history",
      textColor: "#000000",
      className: "font-['SF_Pro', 'SF_Pro_Text', 'SF_Pro_Display']",
    },
    {
      text: "data",
      textColor: "#000000",
      className: "font-['SF_Pro', 'SF_Pro_Rounded', 'SF_Pro_Text']",
    },
  ];

  const states = [
    "Arizona",
    "California",
    "Florida",
    "Florida Discipline",
    "Georgia",
    "Georgia Discipline",
    "Illinois",
    "Kentucky",
    "Louisiana",
    "Maryland",
    "Ohio",
    "Oregon",
    "South Carolina",
    "Tennessee",
    "Texas",
    "Utah",
    "Washington",
    "Vermont",
    "West Virginia",
    "Wyoming",
  ];

  const handleStateClick = (state: string) => {
    if (state === "Louisiana") {
      setIsLouisianaModalOpen(true);
    } else {
      onButtonClick(state);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-max space-y-4 my-28 xl:my-52 2xl:my-72 ${styles.landingScreenContainer}`}
    >
      <TypewriterEffectSmooth
        words={words}
        className={`text-2xl md:text-4xl lg:text-5xl font-bold text-center ${styles.typewriterBase}`}
        cursorClassName={`w-2 h-8 md:h-10 lg:h-12 ${styles.black}`}
      />
      <iframe src="https://data-access-map.netlify.app/" width="100%" height="700px"></iframe>
      <div></div>
      <div></div>
      <div className="flex flex-col items-center justify-center">
        <p className={`${styles.bottomText}`}>
          The National Police Index is a project and data tool showing police
          employment history data obtained from state police training and
          certification boards across the U.S.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {states.map((state) => (
          <button
            key={state}
            className={`${buttonStyles.georgiaButton}`}
            onClick={() => handleStateClick(state)}
          >
            {state}
          </button>
        ))}
      </div>
      <LouisianaModal
        isOpen={isLouisianaModalOpen}
        onClose={() => setIsLouisianaModalOpen(false)}
      />

      <div>
        <button
          className={`items-center ${buttonStyles.stateDataButton}`}
          onClick={() =>
            window.open(
              "https://invisible.institute/national-police-index#block-yui_3_17_2_1_1726594221053_11311",
              "_blank"
            )
          }
        >
          Why isn&apos;t my state&apos;s data here?
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
