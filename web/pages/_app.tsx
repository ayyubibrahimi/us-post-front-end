import { GoogleAnalytics } from "@next/third-parties/google";
import type { AppProps } from "next/app";
import "../styles/global.css";
import Layout from "@/components/Layout";
import localFont from "next/font/local";

const gaId = process.env.NEXT_PUBLIC_GA_ID as string;
const sfFont = localFont({ src: "/fonts/SF-Pro.ttf" });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={sfFont.className}>
      <Layout>
        <Component {...pageProps} />
        <GoogleAnalytics gaId={gaId} />
      </Layout>
    </div>
  );
}

export default MyApp;
