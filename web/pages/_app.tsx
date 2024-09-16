import type { AppProps } from "next/app";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-SQ9DN4BSF4" />
    </>
  );
}

export default MyApp;
