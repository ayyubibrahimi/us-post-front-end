import type { AppProps } from "next/app";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../styles/global.css";
import Layout from "@/components/Layout";

const gaId = process.env.NEXT_PUBLIC_GA_ID as string;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <GoogleAnalytics gaId={gaId} />
    </Layout>
  );
}

export default MyApp;
