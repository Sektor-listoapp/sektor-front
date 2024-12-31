import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ConfigProvider from "antd/lib/config-provider";
import es from "antd/locale/es_ES";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={es}>
      <Component {...pageProps} />;
    </ConfigProvider>
  );
}
