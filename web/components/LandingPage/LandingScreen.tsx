import type React from "react";
import { useState } from "react";
import styles from "./LandingScreen.module.scss";
import buttonStyles from "./LandingScreen.module.scss";
import LouisianaModal from "./LouisianaModal";
import { TypewriterEffectSmooth } from "./TypeWriter";

interface LandingScreenProps {
  onButtonClick: (state: string) => void;
}

// Function to format state names for URLs
const formatStateForUrl = (state: string) => {
  return state.replace(/\s+/g, "-");
};

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

  const handleStateClick = (state: string) => {
    if (state === "Louisiana") {
      setIsLouisianaModalOpen(true);
    } else {
      // Format the state name for URL before passing it to the callback
      const urlFormattedState = formatStateForUrl(state);
      onButtonClick(urlFormattedState);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-max space-y-2 my-12 xl:my-20 2xl:my-24 ${styles.landingScreenContainer}`}
    >
      <iframe
        src="https://data-access-map.netlify.app/"
        width="100%"
        height="530px"
      ></iframe>

      {/* Removed empty div elements */}
      <div className="flex flex-col items-center justify-center -mt-4">
        <p className={`${styles.bottomText}`}>
          The National Police Index is a project and data tool showing police
          employment history data obtained from state police training and
          certification boards across the U.S. In total, 27 states have released
          centralized employment history data, 23 of which are currently
          represented on the data tool.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
        {states.map((state) => (
          <button
            key={state}
            className={`${buttonStyles.stateButtons}`}
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

      <div className="-mt-2">
        <button
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
