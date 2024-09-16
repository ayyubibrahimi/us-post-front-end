import type { AppProps } from "next/app";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../styles/global.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID as string;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId={gaId} />
    </>
  );
}

export default MyApp;
