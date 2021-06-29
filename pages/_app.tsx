import { AppProps } from "next/app";
import "../styles/tailwind.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
