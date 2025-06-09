import type React from "react";
import { useState } from "react";
import GridMap from "./GridMap";
import styles from "./LandingScreen.module.scss";
import buttonStyles from "./LandingScreen.module.scss";
import LouisianaModal from "./LouisianaModal";

interface LandingScreenProps {
  onButtonClick: (state: string) => void;
}

// Function to format state names for URLs
const formatStateForUrl = (state: string) => {
  return state.replace(/\s+/g, "-");
};

const LandingScreen: React.FC<LandingScreenProps> = ({ onButtonClick }) => {
  const [isLouisianaModalOpen, setIsLouisianaModalOpen] = useState(false);

  const states = [
    "Arizona",
    "California",
    "Florida",
    "Florida Discipline",
    "Georgia",
    "Georgia Discipline",
    "Illinois",
    "Idaho",
    "Indiana",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maryland",
    "Minnesota",
    "Mississippi",
    "New Mexico",
    "North Carolina",
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

  return (
    <div
      className={`flex flex-col items-center justify-center h-max space-y-2 my-12 xl:my-20 2xl:my-24 ${styles.landingScreenContainer}`}
    >
      <GridMap
        onStateClick={onButtonClick}
        onLouisianaClick={() => setIsLouisianaModalOpen(true)}
      />

      {isLouisianaModalOpen && (
        <LouisianaModal
          isOpen={isLouisianaModalOpen}
          onClose={() => setIsLouisianaModalOpen(false)}
        />
      )}
      <div className="flex flex-col items-center justify-center -mt-4">
        <p className={`${styles.bottomText}`}>
          The National Police Index is a project and data tool showing police
          employment history data obtained from state police training and
          certification boards across the U.S. In total, 27 states have released
          centralized employment history data, 23 of which are currently
          represented on the data tool.
        </p>
      </div>

      <div className="-mt-2">
        <button
          type="button"
          className={`items-center ${buttonStyles.stateDataButton}`}
          onClick={() =>
            window.open(
              "https://invisible.institute/national-police-index#block-yui_3_17_2_1_1726594221053_11311",
              "_blank",
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
