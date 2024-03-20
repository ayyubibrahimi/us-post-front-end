"use client";
// pages/_app.tsx
import '../styles/global.css'; // Adjust the path to where your global.css file is located
import { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
