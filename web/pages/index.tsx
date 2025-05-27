import Header from "@/components/Header/LandingPageHeader";
import { useRouter } from "next/router";
import React from "react";
import LandingScreen from "../components/LandingPage/LandingScreen";
import styles from "./index.module.scss";

export default function Home() {
  const router = useRouter();

  const handleStateSelection = (state: string) => {
    router.push(`/state/${state}`);
  };

  return (
    <div className={`${styles.pageContainer}`}>
      <Header />
      <main>
        <LandingScreen onButtonClick={handleStateSelection} />
      </main>
    </div>
  );
}
