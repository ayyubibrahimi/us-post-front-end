import React, { useState, useEffect } from "react";
import styles from "./LandingScreenLight.module.scss";
import Map from "../Map";
import { FeatureCollection, MultiLineString, Geometry } from "geojson";

interface MapData {
  land: FeatureCollection<Geometry> | null;
  interiors: MultiLineString | null;
}

export async function fetchMapData(): Promise<MapData> {
  try {
    const response = await fetch("/api/fetchMapData");
    if (!response.ok) {
      throw new Error("Failed to fetch map data");
    }
    const data: MapData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw new Error("Failed to fetch map data");
  }
}

interface LandingScreenProps {
  onButtonClick: (state: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onButtonClick }) => {
  const [data, setData] = useState<MapData | null>(null);
  const states = [
    "Arizona",
    "California",
    "Florida",
    "Georgia",
    "Illinois",
    "Kentucky",
    "Maryland",
    "Idaho",
    "Ohio",
    "Oregon",
    "New Mexico",
    "South Carolina",
    "Tennessee",
    "Texas",
    "Utah",
    "Washington",
    "Vermont",
    "West Virginia",
    "Wyoming",
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const mapData = await fetchMapData();
        setData(mapData);
      } catch (error) {
        console.log("Failed to load map data");
      }
    };
    getData();
  }, []);

  return (
    <div
      className={
        "flex flex-col items-center justify-center min-h-screen bg-white p-4"
      }
    >
      <div className="w-full max-w-screen-lg relative mt-16">
        <Map data={data} availableStates={states} />
      </div>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-screen-lg">

        {states.map((state) => (
          <button
            key={state}
            className={styles.georgiaButton}
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
